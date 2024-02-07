FROM python:3.12

LABEL org.opencontainers.image.authors="Folcoxx"

WORKDIR /usr/src/app

RUN apt update -qy && apt install git ansible ssh sshpass -qy

RUN useradd --no-log-init --shell /bin/bash -m -u 1001 app

RUN chown 1001:1001 /usr/src/app

USER app

COPY --chown=1001:1001 . /usr/src/app

RUN git submodule update --init --recursive && pip3 install --user -r requirements.txt

EXPOSE 9123

CMD ["python3","wsgi.py"]