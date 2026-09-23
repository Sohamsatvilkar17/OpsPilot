from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.database.connection import get_db
from backend.app.models.dataset import Dataset
from backend.app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/datasets",
    tags=["Datasets"]
)


@router.get("/")
def get_datasets(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    datasets = (
        db.query(Dataset)
        .filter(Dataset.user_id == get_user_id(db, current_user))
        .order_by(Dataset.uploaded_at.desc())
        .all()
    )

    return [
        {
            "id": dataset.id,
            "file_name": dataset.file_name,
            "file_type": dataset.file_type,
            "rows": dataset.rows,
            "uploaded_at": dataset.uploaded_at
        }
        for dataset in datasets
    ]


def get_user_id(
    db: Session,
    username: str
):
    from backend.app.models.user import User

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        return -1

    return user.id