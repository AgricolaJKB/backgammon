# Description: Makefile for backend

# setup python
# install venv and dependencies
.PHONY: setup_python
setup_python:
	python3 -m venv venv
	. venv/bin/activate && pip3 install -r requirements.txt &&	deactivate

# setup the database
# create the database and tables
.PHONY: setup_db
setup_db:
	sh scripts/setup_db.sh

# run the backend
.PHONY: run
run:
	venv/bin/fastapi dev main.py

.PHONY: production
production:
	venv/bin/fastapi run main.py