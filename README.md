# CENotes Reaction
## A react js frontend solution for the CENotes backend

- __Free software: GNU General Public License v3__


### What is this?
This is a frontend solution to use for the [CENotes backend](https://github.com/ioparaskev/cenotes)

### Features
Everything the latest version CENotes backend supports 

- Stored / on-the-fly symmetrically encrypted notes
  - Notes can be stored on the server (only the encrypted binary, no key information is stored)
  - Notes can be persistent so that that they are not stored on the server (bigger urls) 
- Duress keys that trigger deletion of a stored note 
  - Using the duresss key instead of the real decryption key will delete the note 
  and respond as if the note didn’t exist (to avoid indicating the use of the duress key)
- Expiration date setting for stored encrypted notes (default 2 weeks)
  - After that date, the notes are deleted and cannot be retrieved (default is never)
- Maximum visits setting for stored encrypted notes (default 1, maximum 100)
  - After N retrievals of a note, the note is deleted (default is 1)
- QR codes for decrypt and duress links


### How to use
Two options:

1. Cloning the repo and running the NodeJS server with the React components
    1. Clone the repo
        -  `git clone https://github.com/ioparaskev/cenotes-reaction.git`
    2. Install the dependencies
        - `npm install`
    3. Start the server
        - `npm run start`
2. Using the packaged bundle
    1. Download the latest release from [here](https://github.com/ioparaskev/cenotes-reaction/releases)
    2. Extract, rename as you wish and serve the build folder
        - Example of an nginx configuration (build folder is renamed-> `cenotes-ui`)
        ```
        server {
            listen 80;
            server_name <your server name / ip>;
        
            # CENOTES-FRONTEND
            root /var/www/html/cenotes-ui;
            index index.html index.htm;
        
            location ~* \.(?:manifest|appcache|html?|xml|json)$ {
              expires -1;
            }
        
            location ~* \.(?:css|js)$ {
              try_files $uri =404;
              expires 1y;
              access_log off;
              add_header Cache-Control "public";
            }
        
            # Any route containing a file extension (e.g. /devicesfile.js)
            location ~ ^.+\..+$ {
              try_files $uri =404;
            }
        
            # Any route that doesn't have a file extension (e.g. /devices)
            location / {
                try_files $uri $uri/ /index.html;
            }
        }
        ```
    3. You will also need to include the endpoint of your backend application
        - Example of nginx configuration for backend running as a uwsgi socket 
        ```
        server {
            listen 80;
            server_name <your server name / ip>;
            # CENOTES-BACKEND
                location /notes {
                    include uwsgi_params;
                    uwsgi_pass  unix:/run/uwsgi/app/cenotes/cenotes.sock;
            #proxy_pass http://83.212.96.88;
                }
        }
        ```
        - Example of nginx configuration for backend running in another site
        ```
        server {
            listen 80;
            server_name <your server name / ip>;
            # CENOTES-BACKEND
                location /notes {
                    proxy_pass http://<backend_url>:<port>;
                }
        }
        ```
