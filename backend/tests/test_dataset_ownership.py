from types import SimpleNamespace

from backend.app.api.datasets import get_datasets


class FakeQuery:
    def __init__(self, result=None):
        self.result = result

    def filter(self, *conditions):
        return self

    def order_by(self, *conditions):
        return self

    def first(self):
        return self.result

    def all(self):
        return self.result


class FakeDB:
    def query(self, model):
        model_name = model.__name__

        if model_name == "User":
            return FakeQuery(
                SimpleNamespace(
                    id=1,
                    username="soham"
                )
            )

        if model_name == "Dataset":
            datasets = [
                SimpleNamespace(
                    id=1,
                    file_name="user1_sales.csv",
                    file_type=".csv",
                    rows=10,
                    uploaded_at=None,
                    user_id=1
                )
            ]

            return FakeQuery(datasets)

        return FakeQuery([])


def test_dataset_ownership():
    db = FakeDB()

    result = get_datasets(
        db=db,
        current_user="soham"
    )

    assert isinstance(result, list)

    assert len(result) == 1

    assert result[0]["id"] == 1
    assert result[0]["file_name"] == "user1_sales.csv"

    assert all(
        dataset["id"] != 2
        for dataset in result
    )