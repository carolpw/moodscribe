# main.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/")
def hello_world():
    return JSONResponse(content={"message": "Home page"})


@app.get("/hello")
def hello_world():
    return JSONResponse(content={"message": "Hello, world!"})
