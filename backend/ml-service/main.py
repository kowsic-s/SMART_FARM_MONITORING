from fastapi import FastAPI, File, UploadFile
import uvicorn
from pydantic import BaseModel

app = FastAPI()

@app.post("/infer")
async def infer(file: UploadFile = File(...)):
    # stub inference: return a dummy result
    return {"infected": False, "confidence": 0.88, "notes": "stub model - replace with real model"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
