# Focus
An app can keep you away from the the distracting website. Focus.js provides a firewall rule for the 'imps' such as facebook, reddit or amazon and a graphic ui for easy setting. This project is greatly inspired from [Focus-py](https://github.com/amoffat/focus).

To begin with
=======
First of all, we need to set your DNS to 127.0.0.1, which allows us to mutate your DNS request.
### Linux

Simply run

    echo nameserver 127.0.0.1 | sudo tee /etc/resolv.conf

in your terminal.

### Mac OS X

You have to do it manually. Go to your Network settings and add '127.0.0.1' as your DNS server.

-----

Now Download the repo, run the following code in your terminal:

	npm start


Define the annoying 'Imps'
=======

Open your browser, go to

    http://localhost:5201/

You can see the graph ui, on which you can just simply kick them out.
![alt text](http://s22.postimg.org/smbpqrglt/Screen_Shot_2016_09_19_at_9_41_22_PM.png "GUI pic")


How it works
======
Same thing as [Andrew](https://github.com/amoffat) has done, basically you're setting your primary nameserver to 127.0.0.1, which is created by Focus. It will receive all the DNS request, and base on the rules you defined, lead the imps to the wrong place.
