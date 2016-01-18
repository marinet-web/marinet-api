[ ![Codeship Status for kibiluzbad/marinet-api](https://www.codeship.io/projects/3afcfab0-1b1d-0132-6dcc-6652309011f6/status)](https://www.codeship.io/projects/34843)


### Instalação

 * `git clone https://jroliveira@bitbucket.org/kibiluzbad/marinet-api.git`
 * `docker build -t marinet-api .`
 * `docker run -i -t marinet-api /bin/bash`
 * `docker ls -a`
 
| CONTAINER ID |    IMAGE    |   COMMAND   |    CREATED    | STATUS | PORTS | NAMES |
|--------------|-------------|-------------|---------------|--------|-------|-------|
| b076f849cac1 | marinet-api | "/bin/bash" | 6 seconds ago | Exited |  --   |  --   |
 
 * `docker start b076f849cac1`
 * `docker exec -i -t b076f849cac1 bash`