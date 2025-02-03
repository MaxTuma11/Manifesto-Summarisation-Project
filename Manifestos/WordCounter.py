import nltk
from nltk.corpus import stopwords
from collections import Counter
import string
import json

nltk.download('stopwords')

#create custom stopwords for manifetos
custom_stopwords = {"manifesto", "manifestos", "party", "parties", "will", "also", "would", "ensure", "•", "labour", "alliance", "conservative", "dup", "green", "greens", "liberal", "democrats",
                     "plaid", "cymru", "reform", "sdlp", "sinn", "féin", "snp", "tuv", "uup", "v", "2023", "2024", "2025", "elected", "–", "●", "❱", "3", "partyof", "→"}

#load manifestos
def load_manifesto(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text

#preprocess text
def preprocess_text(text):
    #set text to lowercase and replace punctuation
    text = text.lower()
    #replace sentence-ending punctuation with spaces
    for punct in ".!?":
        text = text.replace(punct, ' ')
    text = text.translate(str.maketrans('', '', string.punctuation))

    #remove the stopwords
    stop_words = set(stopwords.words('english'))
    stop_words.update(custom_stopwords)
    words = text.split()
    words = [word for word in words if word not in stop_words]

    return words

#count word frequencies
def get_freq_word(words, top_n=10):
    word_counts = Counter(words)
    return word_counts.most_common(top_n)

#implementation
file_path = (r'C:\Users\mtuma\Manifesto-Summarisation-Project\Manifestos\SDLPManifesto.txt')
text = load_manifesto(file_path)
words = preprocess_text(text)
common_words = get_freq_word(words, top_n=20)

with open('common_SDLP.json', 'w') as f:
    json.dump(common_words, f)

print("Most common words: ")
for word, count in common_words:
    print(f"{word}: {count}")