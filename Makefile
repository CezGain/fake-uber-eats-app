IMAGE_NAME = ubereats-frontend
CONTAINER_NAME = ubereats-front

.PHONY: build up down restart logs shell

build:
	docker build -t $(IMAGE_NAME) .

up:
	docker run -d --name $(CONTAINER_NAME) -p 5173:5173 $(IMAGE_NAME)

down:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

restart: down up

logs:
	docker logs -f $(CONTAINER_NAME)

shell:
	docker exec -it $(CONTAINER_NAME) /bin/sh