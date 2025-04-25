import sys
import json
from docx import Document

def extract_subjects(file_path):
    doc = Document(file_path)
    subjects = []

    for table in doc.tables:
        rows = list(table.rows)
        if len(rows) < 2:
            continue

        header_cells = [cell.text.strip() for cell in rows[0].cells]

        try:
            code_idx = header_cells.index("Course Code")
            name_idx = header_cells.index("Name of the Course (Short Name)")
            faculty_idx = header_cells.index("Name of the Course Coordinator (Faculty)")
        except ValueError:
            continue

        for row in rows[1:]:
            cells = [cell.text.strip() for cell in row.cells]
            if len(cells) < max(code_idx, name_idx, faculty_idx) + 1:
                continue

            subject_code = cells[code_idx]
            subject_name = cells[name_idx]
            lecturers = list(set(cells[faculty_idx].split("/")))

            subjects.append({"subjectCode": subject_code, "subjectName": subject_name, "lecturers": lecturers})

    return subjects

if __name__ == "__main__":
    file_path = sys.argv[1]
    extracted_subjects = extract_subjects(file_path)
    print(json.dumps(extracted_subjects))