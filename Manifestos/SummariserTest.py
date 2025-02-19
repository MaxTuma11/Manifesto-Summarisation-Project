from transformers import T5ForConditionalGeneration, T5Tokenizer, MT5ForConditionalGeneration, MT5Tokenizer, pipeline
import nltk
#nltk.download('punkt_tab')
from nltk.tokenize import PunktTokenizer
from nltk.tokenize import sent_tokenize

summarizer = pipeline("summarization", model="Falconsai/text_summarization")

file_path = 'C:/Users/mtuma/Manifesto-Summarisation-Project/Manifestos/Alliance/AllianceEnvironment.txt'

with open(file_path, 'r', encoding='utf-8') as file:
    file_content = file.read()

sequence = file_content

#load model and tokenizer
#model = MT5ForConditionalGeneration.from_pretrained('T-Systems-onsite/mt5-small-sum-de-en-v2')
tokenizer = MT5Tokenizer.from_pretrained('T-Systems-onsite/mt5-small-sum-de-en-v2', legacy = False) 

#function to split text into chunks
def split_text_into_chunks(text, max_tokens=450):
    sentences = sent_tokenize(text)  #split into sentences
    #print(sentences)
    token_chunks = []
    text_chunks = []

    current_token_chunk = []
    current_text_chunk = []
    current_length = 0

    for sentence in sentences:
        tokenized_sentence = tokenizer.encode(sentence, add_special_tokens=False)
        sentence_length = len(tokenized_sentence)

        #if adding this sentence exceeds max_tokens, store current chunk & start new one
        if current_length + sentence_length > max_tokens:
            token_chunks.append(current_token_chunk)
            text_chunks.append(" ".join(current_text_chunk))

            current_token_chunk = tokenized_sentence  #start new chunk
            current_text_chunk = [sentence]
            current_length = sentence_length
        else:
            current_token_chunk.extend(tokenized_sentence)
            current_text_chunk.append(sentence)
            current_length += sentence_length

    #add last chunk if it's not empty
    if current_token_chunk:
        token_chunks.append(current_token_chunk)
        text_chunks.append(" ".join(current_text_chunk))

    return token_chunks, text_chunks


def split_text_by_sentences(text, max_words=200):
    sentences = sent_tokenize(text)  # Split text into sentences
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sentence_words = sentence.split()
        sentence_length = len(sentence_words)

        #if adding this sentence exceeds max_words, save current chunk & start new one
        if current_length + sentence_length > max_words:
            if current_chunk:  #only append if there's something in the chunk
                chunks.append(" ".join(current_chunk))
            
            #start a new chunk with the current sentence
            current_chunk = sentence_words
            current_length = sentence_length
        else:
            #add sentence to current chunk
            current_chunk.extend(sentence_words)
            current_length += sentence_length

    #add the last chunk if it's not empty
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

#function to summarize a chunk
# def summarize_chunk(token_chunk):
#     inputs = tokenizer.encode_plus(
#         token_chunk, 
#         return_tensors="pt", 
#         max_length=512, 
#         truncation=True,
#     )

#     outputs = model.generate(
#         inputs.input_ids,
#         max_length=100, 
#         min_length=50, 
#         length_penalty=2.0, 
#         num_beams=4, 
#         early_stopping=True
#     )

#     return tokenizer.decode(outputs[0], skip_special_tokens=True)



# def summarize_text(text, model, tokenizer, max_length=512, num_beams=5):
#     #preprocess the text
#     inputs = tokenizer.encode(
#         "summarize: " + text,
#         return_tensors='pt',
#         max_length=max_length,
#         truncation=True
#     )
 
#     #generate the summary
#     summary_ids = model.generate(
#         inputs,
#         max_length=200, 
#         min_length=100,
#         num_beams=num_beams,
#         # early_stopping=True,
#     )
 
#     #decode and return the summary
#     return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

#split into chunks
token_chunks, text_chunks = split_text_into_chunks(sequence, max_tokens=450)

chunksy = split_text_by_sentences(sequence, max_words=150)
#print(chunksy)

#summarize each chunk
#summaries = [summarize_text(chunk, model, tokenizer) for chunk in text_chunks]

#combine summaries
#final_summary = " ".join(summaries)

#optionally refine the final summary, not sure if necessary
#summaries2 = [summarize_text(chunk, model, tokenizer) for chunk in text_chunks2]


#refined_summary = " ".join(summaries2)

#fin = summarize_text(refined_summary, model, tokenizer)

# print(final_summary)
# print("NEXT")
# print(refined_summary)
# print("NEXT")
#print(fin)

# print(token_chunks)

summaryFalcon = [summarizer(chunk, max_length=70, min_length=30, do_sample=False) for chunk in chunksy]
falconJoined = " ".join([chunk[0]['summary_text'] for chunk in summaryFalcon])
print(falconJoined)
print("NEXT")

#token_chunks2, text_chunks2 = split_text_into_chunks(falconJoined, max_tokens=450)

# summary2Falcon = [summarizer(chunk, max_length=200, min_length=30, do_sample=False) for chunk in text_chunks2]
# falcon2Joined = " ".join([chunk[0]['summary_text'] for chunk in summary2Falcon])
# print(falcon2Joined)