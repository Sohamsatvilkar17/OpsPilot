
from backend.app.auth.security import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
)


def test_password_hashing():
    password = "TestPassword123!"

    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed)


def test_wrong_password_is_rejected():
    hashed = hash_password("CorrectPassword123!")

    assert not verify_password("WrongPassword123!", hashed)


def test_access_token():
    username = "test_user"

    token = create_access_token(username)

    assert isinstance(token, str)
    assert verify_token(token) == username


def test_invalid_token_is_rejected():
    assert verify_token("invalid-token") is None
