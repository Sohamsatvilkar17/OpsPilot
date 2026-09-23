import os

from dotenv import load_dotenv


load_dotenv()


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/opspilot"
)

APP_NAME = "OpsPilot"
APP_VERSION = "1.0.0"