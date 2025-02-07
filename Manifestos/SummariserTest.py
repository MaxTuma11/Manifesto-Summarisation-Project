from transformers import T5ForConditionalGeneration, T5Tokenizer
import nltk
nltk.download('punkt_tab')
from nltk.tokenize import PunktTokenizer
from nltk.tokenize import sent_tokenize

file_path = 'C:/Users/mtuma/Manifesto-Summarisation-Project/Manifestos/AllianceManifesto.txt'

with open(file_path, 'r', encoding='utf-8') as file:
    file_content = file.read()

sequence = file_content

#load model and tokenizer
model = T5ForConditionalGeneration.from_pretrained('t5-base')
tokenizer = T5Tokenizer.from_pretrained('t5-base')

#function to split text into chunks
def split_text_into_chunks(text, max_tokens=450, overlap=50):
    sentences = sent_tokenize(text)  # Split into sentences
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        tokenized_sentence = tokenizer.encode(sentence, add_special_tokens=False)
        sentence_length = len(tokenized_sentence)

        #if adding this sentence exceeds max_tokens, store current chunk & start new one
        if current_length + sentence_length > max_tokens:
            chunks.append(current_chunk)
            current_chunk = tokenized_sentence  # Start new chunk
            current_length = sentence_length
        else:
            current_chunk.extend(tokenized_sentence)
            current_length += sentence_length

    #add last chunk if it's not empty
    if current_chunk:
        chunks.append(current_chunk)

    return chunks

#function to summarize a chunk
def summarize_chunk(token_chunk):
    inputs = tokenizer.encode_plus(
        token_chunk, 
        return_tensors="pt", 
        max_length=512, 
        truncation=True
    )

    outputs = model.generate(
        inputs.input_ids,
        max_length=200, 
        min_length=50, 
        length_penalty=2.0, 
        num_beams=4, 
        early_stopping=True
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)


#split into chunks
chunks = split_text_into_chunks(sequence, max_tokens=450, overlap=50)

#summarize each chunk
summaries = [summarize_chunk(chunk) for chunk in chunks]

#combine summaries
final_summary = " ".join(summaries)

#optionally refine the final summary, not sure if necessary
refined_summary = summarize_chunk(tokenizer.encode(final_summary, truncation=True, max_length=450))

print(final_summary)
print(refined_summary)