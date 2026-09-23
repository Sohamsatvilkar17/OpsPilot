from pathlib import Path

from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.dataset import Dataset
from backend.app.services.upload_service import (
    get_dataset_info,
    read_dataset
)
from backend.app.services.data_quality_service import (
    check_data_quality
)
from backend.app.services.analytics_service import (
    calculate_business_metrics
)
from backend.app.auth.dependencies import get_current_user
from backend.app.models.user import User


router = APIRouter(
    prefix="/upload",
    tags=["Data Upload"]
)

UPLOAD_FOLDER = Path("data/uploads")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)


@router.post("/")
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    try:
        user = (
            db.query(User)
            .filter(User.username == current_user)
            .first()
        )

        if not user:
            return JSONResponse(
                status_code=401,
                content={"error": "User not found"}
            )

        file_path = UPLOAD_FOLDER / file.filename

        with open(file_path, "wb") as output_file:
            output_file.write(await file.read())

        dataframe = read_dataset(str(file_path))

        dataset_info = get_dataset_info(dataframe)

        quality_report = check_data_quality(dataframe)

        business_metrics = calculate_business_metrics(
            dataframe
        )

        dataset = Dataset(
            file_name=file.filename,
            file_type=Path(file.filename).suffix.lower(),
            file_path=str(file_path),
            rows=len(dataframe),
            user_id=user.id
        )

        db.add(dataset)
        db.commit()
        db.refresh(dataset)

        return {
            "message": "Dataset uploaded successfully",
            "dataset_id": dataset.id,
            "file_name": file.filename,
            "file_type": Path(file.filename).suffix.lower(),
            "dataset": dataset_info,
            "data_quality": quality_report,
            "business_metrics": business_metrics
        }

    except ValueError as error:
        return JSONResponse(
            status_code=400,
            content={"error": str(error)}
        )

    except Exception as error:
        db.rollback()

        return JSONResponse(
            status_code=500,
            content={"error": str(error)}
        )