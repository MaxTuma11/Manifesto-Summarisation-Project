from transformers import pipeline
import nltk
#nltk.download('punkt_tab')
from nltk.tokenize import sent_tokenize
import os
import json
import re

summarizer = pipeline("summarization", model="Falconsai/text_summarization")

#set base directory
base_dir = "C:/Users/mtuma/Manifesto-Summarisation-Project/Manifestos/"

#function to read file content
def read_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()

#function to determine max_words dynamically
def determine_max_words(text_length):
    if text_length < 400:
        return 200  #use smaller chunks for shorter texts
    elif text_length < 800:
        return 300
    else:
        return 400  #default for longer texts

#this function splits the text into chunks with full sentences. 
def split_text_by_sentences(text, max_words=400):
    sentences = sent_tokenize(text)  #split text into sentences
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

#function to summarize text
def summarize_text(text_chunks):
    summaries = []
    
    for chunk in text_chunks:
        chunk_length = len(chunk.split())
        
        #if chunk is very small, adjust max_length
        if chunk_length < 100:
            max_len = chunk_length
            min_len = 30
        elif chunk_length < 200:
            max_len = chunk_length
            min_len = 30
        else:
            max_len = 250
            min_len = 30  

        summary = summarizer(chunk, max_length=max_len, min_length=min_len, do_sample=False)[0]['summary_text']
        summaries.append(summary)

    summaries = " ".join(summaries)

    #if len(summaries.split()) > 350:
    #    print("Refining long summary...")
    #    summaries = summarizer(summaries, max_length=300, min_length=30, do_sample=False)[0]['summary_text']

    return summaries

def clean_summary(text):
    #fix spaces before punctuation
    text = re.sub(r'\s+([.,!?])', r'\1', text)  
    #capitalize first letter of each sentence
    text = re.sub(r'(^|\.\s+)([a-z])', lambda match: match.group(1) + match.group(2).upper(), text)

    return text

#dictionary to store summaries
summaries_dict = {}
text_chunks_dict = {}

#loop through each party folder
for party_folder in os.listdir(base_dir):
    party_path = os.path.join(base_dir, party_folder)
    file_path = os.path.join(party_path, f"{party_folder}Base.txt")  #construct file path

    if os.path.isdir(party_path) and os.path.exists(file_path):  #check if folder & file exist
        print(f"Processing: {party_folder}")

        #read and summarize manifesto
        text = read_file(file_path)
        max_words = determine_max_words(len(text.split()))
        text_chunks = split_text_by_sentences(text, max_words)

        text_chunks_dict[party_folder] = text_chunks

        #summarize and clean text
        summary = summarize_text(text_chunks)
        summary = clean_summary(summary)

        #store in dictionary
        summaries_dict[party_folder] = summary

#check text chunks
output_json_path1 = "C:/Users/mtuma/Manifesto-Summarisation-Project/Manifesto_Chunks.json"
with open(output_json_path1, "w", encoding="utf-8") as json_file:
    json.dump(text_chunks_dict, json_file, indent=4, ensure_ascii=False)

#save to JSON file
output_json_path = "C:/Users/mtuma/Manifesto-Summarisation-Project/Manifesto_Summaries.json"
with open(output_json_path, "w", encoding="utf-8") as json_file:
    json.dump(summaries_dict, json_file, indent=4, ensure_ascii=False)

print(f"Summaries saved to {output_json_path}")