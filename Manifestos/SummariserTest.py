import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline, BartTokenizer, BartModel

tokenizer = AutoTokenizer.from_pretrained('t5-large')
model = AutoModelForSeq2SeqLM.from_pretrained('t5-large', return_dict=True)

#tokenizer2 = BartTokenizer.from_pretrained('facebook/bart-large')
#model2 = BartModel.from_pretrained('facebook/bart-large')

file_path = 'C:/Users/mtuma/Manifesto-Summarisation-Project/Manifestos/LabourManifesto.txt'

with open(file_path, 'r', encoding='utf-8') as file:
    file_content = file.read()

sequence = file_content

#inputs = tokenizer2.encode(sequence, return_tensors="pt")
#outputs = model2(**inputs)

inputs = tokenizer.encode("summarize: " + sequence, return_tensors='pt', max_length=512, truncation=False)

outputs = model.generate(inputs, max_length=150, min_length=100, length_penalty=1., num_beams=2)

summary = tokenizer.decode(outputs[0])

print(summary)

#summarizer = pipeline(
#     "summarization",
#     "pszemraj/long-t5-tglobal-base-16384-book-summary",
#     device=0 if torch.cuda.is_available() else -1,
# )

# #result = summarizer(sequence)
# print(result[0]["summary_text"])