from motor.motor_asyncio import AsyncIOMotorClient

mongo_url = 'mongodb://localhost:27017'


client = AsyncIOMotorClient(mongo_url)

database = client.quizo
user_collection = database.users
quiz_collection = database.quiz
question_collection = database.question