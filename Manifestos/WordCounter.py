import nltk
from nltk.corpus import stopwords
from collections import Counter
import string
import json
from itertools import islice
import re

#nltk.download('stopwords')

#create custom stopwords for manifetos
custom_stopwords = {"manifesto", "manifestos", "party", "parties", "will", "also", "would", "ensure", "•", "labour", "alliance", "conservative", "dup", "green", "greens", "liberal", "democrats",
                     "plaid", "cymru", "sdlp", "sinn", "féin", "snp", "tuv", "uup", "v", "2023", "2024", "2025", "elected", "–", "●", "❱", "3", "partyof", "→", "\"", "x", "government"}

#list of unwanted common trigrams (to filter)
unwanted_trigrams = {("set", "chapter", "20"), ("set", "chapter", "4"), ("set", "chapter", "18"), ("set", "chapter", "7"), ("set", "chapter", "20."), ("set", "chapter", "4."), ("set", "chapter", "7."), ("areas", "set", "chapter")}

#load manifestos
def load_manifesto(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    return text

#preprocess text
def preprocess_text(text):
    #set text to lowercase and replace punctuation
    text = text.lower()

    #remove occurences of "reform uk" only necessary for reform manifesto parsing
    text = text.replace("reform uk", "")

    text = re.sub(r"[“”‘’´`]", "", text)  #removes curly quotes and backticks

    text = re.sub(r'(?<!\d)[.,!?](?!\d)', '', text)  #remove punctuation that is NOT between digits

    #remove all other punctuation (excluding decimals in numbers)
    text = text.translate(str.maketrans('', '', string.punctuation.replace('.', '')))

    #restore decimal points
    text = text.replace(' DECIMAL ', '.')

    #remove the stopwords
    stop_words = set(stopwords.words('english'))
    stop_words.update(custom_stopwords)
    words = text.split()
    words = [word for word in words if word not in stop_words]

    return words

#generate bigrams and trigrams
def get_ngrams(words, n=2, top_n=10, filter_trigrams=False):
    ngrams = zip(*[islice(words, i, None) for i in range(n)])  #create n-grams
    ngram_counts = Counter(ngrams)

    #if filter trigrams is true
    if filter_trigrams and n == 3:
        ngram_counts = Counter({trigram: count for trigram, count in ngram_counts.items() if trigram not in unwanted_trigrams})

    return ngram_counts.most_common(top_n)

#count word frequencies
def get_freq_word(words, top_n=10):
    word_counts = Counter(words)
    return word_counts.most_common(top_n)

#implementation
file_path = (r'C:\Users\mtuma\Manifesto-Summarisation-Project\Manifestos\LibDem\LibDemManifesto.txt')
text = load_manifesto(file_path)
words = preprocess_text(text)

#get common words, bigrams, and trigrams
common_words = get_freq_word(words, top_n=20)
common_bigrams = get_ngrams(words, n=2, top_n=20)
common_trigrams = get_ngrams(words, n=3, top_n=20, filter_trigrams=True)

#convert tuples to lists for JSON serialization
common_bigrams = [{"bigram": " ".join(pair), "count": count} for pair, count in common_bigrams]
common_trigrams = [{"trigram": " ".join(trio), "count": count} for trio, count in common_trigrams]

#write to files
with open('common_Liberal Democrat Party.json', 'w') as f:
    json.dump(common_words, f)

# with open('common_Reform_bigrams.json', 'w') as f:
#     json.dump(common_bigrams, f)

with open('common_Liberal Democrat Party_trigrams.json', 'w') as f:
    json.dump(common_trigrams, f)


print("Most common words: ")
for word, count in common_words:
    print(f"{word}: {count}")

# print("\nMost common bigrams:")
# for item in common_bigrams:
#     print(f"{item['bigram']}: {item['count']}")

print("\nMost common trigrams:")
for item in common_trigrams:
    print(f"{item['trigram']}: {item['count']}")