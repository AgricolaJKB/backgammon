# Description: Makefile for backend

# install venv and dependencies
.PHONY: setup
setup:
	python3 -m venv venv
	. venv/bin/activate && pip install -r requirements.txt
	deactivate

# run the backend
.PHONY: run
run:
	venv/bin/fastapi dev main.py

.PHONY: production
	venv/bin/fastapi run main.py