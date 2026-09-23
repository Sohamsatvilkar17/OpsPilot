from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.dataset import Dataset
from backend.app.models.user import User
from backend.app.auth.dependencies import get_current_user

from backend.app.services.upload_service import read_dataset
from backend.app.services.analytics_service import calculate_business_metrics
from backend.app.services.data_quality_service import check_data_quality
from backend.app.services.anomaly_service import detect_anomalies
from backend.app.services.alert_service import generate_alerts


router = APIRouter(
    prefix="/alerts",
    tags=["Alerts & Notifications"]
)


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


@router.get("/{dataset_id}")
def get_alerts(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        dataset, file_path = get_dataset_file(
            dataset_id,
            db,
            current_user
        )

        dataframe = read_dataset(
            str(file_path)
        )

        metrics = calculate_business_metrics(
            dataframe
        )

        quality_report = check_data_quality(
            dataframe
        )

        anomaly_report = detect_anomalies(
            dataframe
        )

        alerts = generate_alerts(
            metrics,
            quality_report,
            anomaly_report
        )

        return {
            "dataset_id": dataset.id,
            "file_name": dataset.file_name,
            "alerts": alerts
        }

    except HTTPException:
        raise

    except Exception as error:
        return {
            "error": str(error)
        }