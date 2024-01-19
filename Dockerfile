FROM python:3.12

LABEL org.opencontainers.image.authors="Folcoxx"

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apt update -qy && apt install git ansible ssh sshpass -qy

RUN git submodule update --init --recursive && pip3 install -r requirements.txt

EXPOSE 9123

CMD ["python3","src/main.py"]