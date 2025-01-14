import torch
from transformers import AutoTokenizer, AutoModelWithLMHead
import os

tokenizer = AutoTokenizer.from_pretrained('t5-large')
model = AutoModelWithLMHead.from_pretrained('t5-large', return_dict=True)

file_path = 'C:/Users/mtuma/Manifesto-Summarisation-Project/Manifestos/LabourManifesto.txt'

with open(file_path, 'r', encoding='utf-8') as file:
    file_content = file.read()

sequence = file_content

inputs = tokenizer.encode("summarize: " + sequence, return_tensors='pt', max_length=512, truncation=True)

outputs = model.generate(inputs, max_length=200, min_length=200, length_penalty=1., num_beams=2)

summary = tokenizer.decode(outputs[0])

print(summary)