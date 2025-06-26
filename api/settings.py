from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    gemini_api_key: str
    mongo_db_url: str
    promo_api_url: str
    promo_adm_user: str
    promo_adm_pass: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
