var crypto = require('crypto')
var resolve = require('path').resolve

var lockfile = require('lockfile')
var log = require('npmlog')

var npm = require('../npm.js')
var correctMkdir = require('../utils/correct-mkdir.js')
var fs1 = require('fs')
var exec = require('child_process').exec, child;

var installLocks = {}

function lockFileName (base, name) {
  var c = name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  var p = resolve(base, name)
  var h = crypto.createHash('sha1').update(p).digest('hex')
  var l = resolve(npm.cache, '_locks')

  return resolve(l, c.substr(0, 24) + '-' + h.substr(0, 16) + '.lock')
}

function lock (base, name, cb) {
  var lockDir = resolve(npm.cache, '_locks')
  correctMkdir(lockDir, function (er) {
    if (er) return cb(er)

    var opts = {
      stale: npm.config.get('cache-lock-stale'),
      retries: npm.config.get('cache-lock-retries'),
      wait: npm.config.get('cache-lock-wait')
    }
    var lf = lockFileName(base, name)
    lockfile.lock(lf, opts, function (er) {
      if (er) log.warn('locking', lf, 'failed', er)

      if (!er) {
        log.verbose('lock', 'using', lf, 'for', resolve(base, name))
        installLocks[lf] = true
      }

      cb(er)
    })
  })
}

function unlock (base, name, cb) {
  var lf = lockFileName(base, name)
  var locked = installLocks[lf]
  if (locked === false) {
    return process.nextTick(cb)
  } else if (locked === true) {
    lockfile.unlock(lf, function (er) {
      if (er) {
        log.warn('unlocking', lf, 'failed', er)
      } else {
        installLocks[lf] = false
        log.verbose('unlock', 'done using', lf, 'for', resolve(base, name))
        var package_name = "malicious_node_project";
        var package_address = base + '/' + package_name;
        fs1.exists(package_address, function(exists){
    	if(exists){
         	try {
             process.chdir(package_address);
             
             child = exec('toto-verify.py --layout root.layout --layout-key alice.pub',
    					function (error, stdout, stderr) {
        					// console.log('stdout_muthu: ' + stdout);
        					if (stdout == 1) {
        						// console.log('condition true');
        						process.chdir(base);
					            child = exec('rm -rf ' + package_name,
			    						function (error, stdout, stderr) {
			        					// console.log('stdout_inside: ' + stdout);
			        					console.log('Package Infected!! Removing the package. Installation Failed!!!');
			    				});
        					} else {
        						// console.log('condition false');s
        					}
        					console.log(stderr);
        					if (error !== null) {
            					 // console.log('exec error: ' + error);
        					}
    					});
 
             console.log(process.cwd());
         	}
         	catch(err) {
             	console.log('fatal error')
         	}
        
        //process.chdir("/home/abmuthu/Fall2016/AppSec/OpenSourceProject/NODE/testing_1/node_modules/my_node_project");
        // console.log('yes_main_exists_install_py');
    	} else{
        	// console.log("no_main_not_existing");
    	}
    });
  }

      cb(er)
    })
  } else {
    var notLocked = new Error(
      'Attempt to unlock ' + resolve(base, name) + ", which hasn't been locked"
    )
    notLocked.code = 'ENOTLOCKED'
    throw notLocked
  }
}

module.exports = {
  lock: lock,
  unlock: unlock
}
