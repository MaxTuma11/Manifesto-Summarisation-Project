import re

def remove_standalone_3(file_path):

    with open(file_path, "r", encoding="utf-8") as file:
        text = file.read()

    #use regex to match standalone "3" (surrounded by whitespace or line breaks)
    cleaned_text = re.sub(r'\b3\b', '', text)
    
    #remove extra spaces caused by deletion
    #cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
    
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(cleaned_text)

file_path =  r"C:\Users\mtuma\Manifesto-Summarisation-Project\Manifestos\DUP\DUPTransport.txt"
remove_standalone_3(file_path)
print(f"Processed file: {file_path}")