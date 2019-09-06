docker run -d -p 27017:27017 --mount type=bind,source=\$PWD/data/bin,target=/data/bin --name mongodb mongo
