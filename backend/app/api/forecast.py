from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.dataset import Dataset
from backend.app.models.user import User
from backend.app.auth.dependencies import get_current_user

from backend.app.services.upload_service import read_dataset
from backend.app.services.forecast_service import forecast_revenue


router = APIRouter(
    prefix="/forecast",
    tags=["Forecasting"]
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
        raise ValueError("Dataset file not found")

    return dataset, file_path


@router.get("/{dataset_id}")
def get_forecast(
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

        forecast_report = forecast_revenue(
            dataframe,
            periods=3
        )

        return {
            "dataset_id": dataset.id,
            "file_name": dataset.file_name,
            "forecast": forecast_report
        }

    except HTTPException:
        raise

    except Exception as error:
        return {
            "error": str(error)
        }