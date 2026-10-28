import time
import os
import json

students = []
FILE_NAME = "students.json"


def loading_animation(steps=25, message="Loading"):
    block = chr(9608)
    bar_length = 20

    for i in range(steps + 1):
        filled_length = int(bar_length * i / steps)
        bar = block * filled_length + "-" * (bar_length - filled_length)
        percent = int(100 * i / steps)
        print(f"\r{message}: [{bar}] {percent}%", end="", flush=True)
        time.sleep(0.03)

    print()


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def pause():
    input("\nPress Enter to continue...")


def load_students():
    global students

    if os.path.exists(FILE_NAME):
        try:
            with open(FILE_NAME, "r") as file:
                data = json.load(file)

            if isinstance(data, list):
                students = [
                    student for student in data
                    if isinstance(student, dict)
                    and all(key in student for key in
                            ("id", "name", "course", "year"))
                ]

        except (json.JSONDecodeError, OSError):
            students = []


def save_students():
    try:
        with open(FILE_NAME, "w") as file:
            json.dump(students, file, indent=4)
    except OSError:
        print("\nError: Unable to save student records.")


def startup():
    clear_screen()
    print("=" * 45)
    print("        STUDENT MANAGEMENT SYSTEM")
    print("=" * 45)

    loading_animation(message="Starting system")
    load_students()

    print(f"\nSystem ready! {len(students)} student record(s) loaded.")
    time.sleep(1)


def find_student(student_id):
    for student in students:
        if student["id"].lower() == student_id.lower():
            return student
    return None


def get_input(prompt):
    while True:
        value = input(prompt).strip()

        if value:
            return value

        print("Input cannot be empty.")


def add_student():
    print("\n======= ADD STUDENT =======")

    student_id = get_input("Enter Student ID: ")

    if find_student(student_id):
        print("Error: Student ID already exists!")
        return

    name = get_input("Enter Name: ")
    course = get_input("Enter Course: ")
    year = get_input("Enter Year Level: ")

    students.append({
        "id": student_id,
        "name": name,
        "course": course,
        "year": year
    })

    save_students()
    print("\nStudent added successfully!")


def view_students():
    print("\n======= ALL STUDENTS =======")

    if not students:
        print("\nNo students found.")
        return

    print("-" * 75)
    print(f"{'ID':<15}{'NAME':<25}{'COURSE':<20}{'YEAR':<10}")
    print("-" * 75)

    for student in sorted(students, key=lambda s: s["name"].lower()):
        print(
            f"{student['id']:<15}"
            f"{student['name'][:24]:<25}"
            f"{student['course'][:19]:<20}"
            f"{student['year']:<10}"
        )

    print("-" * 75)
    print(f"Total records: {len(students)}")


def display_student(student):
    print("\n" + "-" * 35)
    print(f"Student ID : {student['id']}")
    print(f"Name       : {student['name']}")
    print(f"Course     : {student['course']}")
    print(f"Year Level : {student['year']}")
    print("-" * 35)


def search_student():
    print("\n======= SEARCH STUDENT =======")
    keyword = get_input("Enter Student ID or Name: ").lower()

    matches = [
        student for student in students
        if keyword in student["id"].lower()
        or keyword in student["name"].lower()
    ]

    if not matches:
        print("\nNo matching students found.")
        return

    print(f"\nFound {len(matches)} matching student(s).")

    for student in matches:
        display_student(student)


def update_student():
    print("\n======= UPDATE STUDENT =======")
    student_id = get_input("Enter Student ID: ")
    student = find_student(student_id)

    if not student:
        print("Student not found!")
        return

    display_student(student)
    print("Press Enter to keep the current value.")

    new_name = input(f"New Name [{student['name']}]: ").strip()
    new_course = input(f"New Course [{student['course']}]: ").strip()
    new_year = input(f"New Year [{student['year']}]: ").strip()

    if new_name:
        student["name"] = new_name

    if new_course:
        student["course"] = new_course

    if new_year:
        student["year"] = new_year

    save_students()
    print("\nStudent information updated successfully!")


def delete_student():
    print("\n======= DELETE STUDENT =======")
    student_id = get_input("Enter Student ID: ")
    student = find_student(student_id)

    if not student:
        print("Student not found!")
        return

    display_student(student)
    confirmation = input("Delete this student? [Y/N]: ").strip().upper()

    if confirmation == "Y":
        students.remove(student)
        save_students()
        print("Student deleted successfully!")
    else:
        print("Deletion cancelled.")


def count_students():
    print("\n======= STUDENT STATISTICS =======")
    print(f"Total Students: {len(students)}")

    if not students:
        return

    courses = {}
    years = {}

    for student in students:
        course = student["course"]
        year = student["year"]

        courses[course] = courses.get(course, 0) + 1
        years[year] = years.get(year, 0) + 1

    print("\nStudents by Course:")

    for course, count in sorted(courses.items()):
        print(f"{course}: {count}")

    print("\nStudents by Year Level:")

    for year, count in sorted(years.items()):
        print(f"Year {year}: {count}")


def filter_students():
    print("\n======= FILTER STUDENTS =======")
    print("1. Filter by Course")
    print("2. Filter by Year Level")

    choice = input("Choose filter: ").strip()

    if choice == "1":
        value = get_input("Enter Course: ").lower()
        matches = [
            s for s in students
            if s["course"].lower() == value
        ]

    elif choice == "2":
        value = get_input("Enter Year Level: ").lower()
        matches = [
            s for s in students
            if s["year"].lower() == value
        ]

    else:
        print("Invalid choice.")
        return

    if not matches:
        print("No students found for this filter.")
        return

    print(f"\nFound {len(matches)} student(s).")

    for student in matches:
        display_student(student)


def export_students():
    print("\n======= EXPORT STUDENTS =======")

    if not students:
        print("No student records available to export.")
        return

    filename = input(
        "Enter export filename [student_backup.json]: "
    ).strip()

    if not filename:
        filename = "student_backup.json"

    if not filename.lower().endswith(".json"):
        filename += ".json"

    try:
        with open(filename, "w") as file:
            json.dump(students, file, indent=4)

        print(f"Records exported successfully to {filename}!")

    except OSError:
        print("Error: Unable to export records.")


def main():
    while True:
        print("\n" + "=" * 45)
        print("        STUDENT MANAGEMENT SYSTEM")
        print("=" * 45)
        print("1. Add Student")
        print("2. View Students")
        print("3. Search Student")
        print("4. Update Student")
        print("5. Delete Student")
        print("6. Count Students")
        print("7. Filter Students")
        print("8. Export Student Records")
        print("9. Exit")
        print("=" * 45)

        choice = input("Enter your choice [1-9]: ").strip()

        if choice == "1":
            add_student()
        elif choice == "2":
            view_students()
        elif choice == "3":
            search_student()
        elif choice == "4":
            update_student()
        elif choice == "5":
            delete_student()
        elif choice == "6":
            count_students()
        elif choice == "7":
            filter_students()
        elif choice == "8":
            export_students()
        elif choice == "9":
            print("\nSaving student records...")
            save_students()
            print("Thank you for using the Student Management System!")
            break
        else:
            print("Invalid choice. Please select from 1 to 9.")

        pause()


if __name__ == "__main__":
    startup()
    main()