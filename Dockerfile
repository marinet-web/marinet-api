FROM  centos/c7-systemd 
MAINTAINER Junior Oliveira "junolive@gmail.com"


##########################
##### Install ZeroMQ #####
##########################

# Update the Default Operating System Tools

RUN yum -y update; yum clean all

# Download Additional Tools for Building From Source

RUN yum -y install uuid-devel; yum clean all
RUN yum -y install pkgconfig initscripts; yum clean all
RUN yum -y install libtool; yum clean all
RUN yum -y install gcc-c++; yum clean all

# Let's begin with downloading the application source

RUN yum -y install wget; yum clean all
RUN wget http://download.zeromq.org/zeromq-4.0.3.tar.gz

# Extract the contents of the tar archive and enter the directory

RUN tar xzvf zeromq-4.0.3.tar.gz
WORKDIR zeromq-4.0.3

# Configure the application build procedure

RUN ./configure

# Build the program using the Makefile

RUN yum -y install make; yum clean all
RUN make

# Install the application

RUN make install

# Update the system library cache

RUN echo /usr/local/lib > /etc/ld.so.conf.d/local.conf
RUN ldconfig


##########################
##### Install Nodejs #####
##########################

RUN curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
RUN yum -y install nodejs; yum clean all

# Optional: install build tools

RUN yum -y groupinstall 'Development Tools'; yum clean all


###########################
##### Install MongoDB #####
###########################

# Configure the package management system (yum).

RUN echo $'[mongodb-org-3.2] \n\
name=MongoDB Repository \n\
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.2/x86_64/ \n\
gpgcheck=0 \n\
enabled=1' > /etc/yum.repos.d/mongodb-org-3.2.repo

# Install the MongoDB packages and associated tools.

RUN yum -y install mongodb-org ; yum clean all;systemctl enable mongod;  

#########################
##### Install Redis #####
#########################

# Let's begin with downloading the application source

RUN wget http://download.redis.io/releases/redis-3.0.6.tar.gz

# Extract the contents of the tar archive and enter the directory

RUN tar xzvf redis-3.0.6.tar.gz
WORKDIR redis-3.0.6

# Build the program using the Makefile

RUN make


#######################
##### Install Git #####
#######################

RUN yum -y install git-all; yum clean all


#######################
##### Install Vim #####
#######################

RUN yum -y install vim; yum clean all


#######################
##### Install App #####
#######################

# Make ssh dir

RUN mkdir /root/.ssh/

# Copy over private key, and set permissions

ADD id_rsa /root/.ssh/id_rsa
RUN chmod 400 /root/.ssh/id_rsa

# Create known_hosts

RUN touch /root/.ssh/known_hosts

# Add bitbuckets key

RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts

# Clone the conf files into the docker container

RUN mkdir /work
RUN git clone git@bitbucket.org:kibiluzbad/marinet-api.git /work/marinet-api

# Setup app

WORKDIR /work/marinet-api
RUN npm install -g node-gyp 
RUN npm install
RUN cd node_modules/mongodb && npm install
CMD ["/usr/sbin/init","npm start"]

