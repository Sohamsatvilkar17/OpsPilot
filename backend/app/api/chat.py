from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.dataset import Dataset
from backend.app.models.user import User
from backend.app.auth.dependencies import get_current_user

from backend.app.services.upload_service import read_dataset
from backend.app.services.analytics_service import calculate_business_metrics
from backend.app.services.data_quality_service import check_data_quality
from backend.app.services.anomaly_service import detect_anomalies
from backend.app.services.insight_service import generate_insights

from backend.app.ai.business_analyst import generate_business_analysis


router = APIRouter(
    prefix="/chat",
    tags=["AI Chatbot"]
)


class ChatRequest(BaseModel):
    question: str


def get_dataset_file(
    dataset_id: int,
    db: Session,
    current_user: str
):
    user = (
        db.query(User)
        .filter(User.username == current_user)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    dataset = (
        db.query(Dataset)
        .filter(
            Dataset.id == dataset_id,
            Dataset.user_id == user.id
        )
        .first()
    )

    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    if not dataset.file_path:
        raise ValueError(
            "File path not available for this dataset"
        )

    file_path = Path(dataset.file_path)

    if not file_path.exists():
        raise ValueError(
            "Dataset file not found"
        )

    return dataset, file_path


def question_needs_quality(question):
    question = question.lower()

    keywords = [
        "data quality",
        "quality score",
        "quality",
        "missing",
        "duplicate",
        "invalid data"
    ]

    return any(
        keyword in question
        for keyword in keywords
    )


def question_needs_anomalies(question):
    question = question.lower()

    keywords = [
        "anomaly",
        "anomalies",
        "unusual",
        "outlier",
        "risk"
    ]

    return any(
        keyword in question
        for keyword in keywords
    )


def question_needs_recommendations(question):
    question = question.lower()

    keywords = [
        "recommend",
        "recommendation",
        "suggest",
        "advice",
        "improve",
        "what should i do",
        "what should we do"
    ]

    return any(
        keyword in question
        for keyword in keywords
    )


def question_needs_full_analysis(question):
    question = question.lower()

    keywords = [
        "complete analysis",
        "full analysis",
        "overall performance",
        "business performance",
        "analyze my business",
        "analyse my business",
        "deep analysis",
        "explain why",
        "why did revenue",
        "why is revenue",
        "what is driving",
        "driving growth"
    ]

    return any(
        keyword in question
        for keyword in keywords
    )


@router.post("/{dataset_id}")
def chat_with_dataset(
    dataset_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        dataset, file_path = get_dataset_file(
            dataset_id,
            db,
            current_user
        )

        question = request.question.strip()

        dataframe = read_dataset(
            str(file_path)
        )

        # ---------------------------------------------
        # Always calculate basic business metrics
        # ---------------------------------------------

        metrics = calculate_business_metrics(
            dataframe
        )

        # ---------------------------------------------
        # Decide what additional analysis is required
        # ---------------------------------------------

        needs_quality = question_needs_quality(
            question
        )

        needs_anomalies = question_needs_anomalies(
            question
        )

        needs_recommendations = question_needs_recommendations(
            question
        )

        needs_full_analysis = question_needs_full_analysis(
            question
        )

        # Recommendations need quality and anomaly data.
        if needs_recommendations:
            needs_quality = True
            needs_anomalies = True

        # Complex AI analysis needs everything.
        if needs_full_analysis:
            needs_quality = True
            needs_anomalies = True

        # ---------------------------------------------
        # Only run quality analysis when required
        # ---------------------------------------------

        if needs_quality:
            quality_report = check_data_quality(
                dataframe
            )
        else:
            quality_report = {}

        # ---------------------------------------------
        # Only run anomaly detection when required
        # ---------------------------------------------

        if needs_anomalies:
            anomaly_report = detect_anomalies(
                dataframe
            )
        else:
            anomaly_report = {}

        # ---------------------------------------------
        # Only generate insights for complex questions
        # ---------------------------------------------

        if needs_full_analysis:
            insights = generate_insights(
                metrics,
                quality_report,
                anomaly_report
            )
        else:
            insights = []

        # ---------------------------------------------
        # Generate final response
        # ---------------------------------------------

        response = generate_business_analysis(
            question,
            metrics,
            quality_report,
            anomaly_report,
            insights
        )

        return {
            "dataset_id": dataset.id,
            "file_name": dataset.file_name,
            "question": question,
            "response": response
        }

    except HTTPException:
        raise

    except Exception as error:
        return {
            "error": str(error)
        }