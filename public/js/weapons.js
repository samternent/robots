
window.onload = function() {

var weapons = new Weapons();
    
    //Initialize weapons
    weapons.init();

};


// Bot Weapons
var Weapons = function() {

	var settings = {

		type		: "",
		fireRange	: 50,
		fireRate	: 25,
		fireRangeAngle : 360,
		firePower	: 15,
		cost		: 200,
		duration	: 100,
		health		: 100,
		level		: 1,
        timerId     : 0
	},
        
	// Get bot weapons
	getBotWeapons = function() {
        var botWeapons = document.getElementById('laserGun');
        
        botWeapons.style.top = '0px';
        botWeapons.style.left = '0px';
        
		return botWeapons;  
	},
        
	// Fire Weapon
	fireWeapon = function() {
        var element = getBotWeapons();

        settings.timerId = setInterval(function(){
            
            var scaleX = Math.cos(45),
            scaleY = Math.sin(45),
            velocityX = settings.fireRate * scaleX,
            velocityY = settings.fireRate * scaleY,
            topPosition = Math.floor(parseInt(element.style.top)),
            leftPosition = Math.floor(parseInt(element.style.left));
            
            element.style.top = topPosition + velocityY + 'px';
            element.style.left = leftPosition + velocityX + 'px';
            
            if(leftPosition  >= settings.fireRange){
                stopFiring();
            }
            
        }, settings.duration);
                
	},
    
    // Stop firing weapon
    stopFiring = function() {
      clearInterval(settings.timerId);  
    },
        
    // Check weapon uses
    weaponStatus = function() {
        
    },  
        
    // initialize
    init = function () {
        fireWeapon();
    };
    
    
    return {
        init : init,
    }

};