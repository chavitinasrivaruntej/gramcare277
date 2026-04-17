
import os
import re

def check_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find JSX components
    components = set(re.findall(r'<([A-Z][a-zA-Z0-9]+)', content))
    # Simple regex to find imports
    imports = set(re.findall(r'([A-Z][a-zA-Z0-9]+)', re.search(r'import {([^}]+)} from "lucide-react"', content).group(1) if re.search(r'import {([^}]+)} from "lucide-react"', content) else ""))
    
    # Also check other imports if needed, but lucide-react is the main culprit
    missing = components - imports
    # filter out known components that are not icons
    ui_components = {'Card', 'CardContent', 'CardHeader', 'CardTitle', 'CardDescription', 'Button', 'Badge', 'Tabs', 'TabsContent', 'TabsList', 'TabsTrigger', 'Input', 'VideoCallInterface'}
    missing = missing - ui_components
    
    if missing:
        print(f"File: {filepath}")
        print(f"Missing Imports: {missing}")

# Check the files in components/doctor
dir_path = r'c:\Users\SRI VARUN TEJ\healthcarecentre\frontend\src\components\doctor'
for filename in os.listdir(dir_path):
    if filename.endswith('.js'):
        try:
            check_file(os.path.join(dir_path, filename))
        except Exception as e:
            print(f"Error checking {filename}: {e}")
