 npm integration with in-toto
                                   
                                   
                                   Instructions:
------------------------------------------------------------------------------
Step 1:  Download/clone the node (node has the modified npm in it)
Step 2:  Create a virtual env

Install in-toto:
---------------

Step 3:  Install in-toto by following the in-toto README.md

Install modified Node:
--------------------

Step 4:  Change the Package name in "node-v6.9.1/deps/npm/lib/utils/locker.js"          
         line-no: 59 (Temporary step)

Step 5:  Change directory to node-v6.9.1
Step 5:  Install the node by executing following commands in order
            i)   ./configure
            ii)  make
            iii) sudo make install

Testing:
--------

npm install some_package


Note1: You can use the packages indexed by us
        
        Valid Pacakge Name      : my_node_project
        Malicious Package Name  : malicious_node_project
        
Note2: To install a new package with toto-verification
        i)      uninstall the node by executing the command "sudo make uninstall"
        ii)     Change the Package name in "node-v6.9.1/deps/npm/lib/utils/locker.js" line-no: 59 (Temporary step)
        iii)    install it again by "sudo make install"
