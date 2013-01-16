/*
	TODO:
	-what if you change the address while the spinner is loading, before response received?
	-Warning icon for override & server down? Default icon when loading existing ticket must change for this
*/

var SERVICE_AREAS = {
	'SA_PLANNING_2000Councilmanic': {
		id: 'SA_PLANNING_2000Councilmanic',
		node: NODES.citycouncil,
		table: TABLES.citycouncil
	},
	'SA_POLICE_District': {
		id: 'SA_POLICE_District',
		node: NODES.police,
		table: TABLES.police
	},
	'311_Mobile': {
		id: '311_Mobile',
		node: NODES.phillyrising,
		table: TABLES.phillyrising
	}
};

var MIN_CONFIDENCE = 85;
var VERIFIED_DEFAULT = '1';
var VERIFIED_OVERRIDE = '2';
var OVERRIDE_STRING = '*';
var ICONS = {
    spinner: {url: 'http://philly311.phila.gov/admin/virtual/imgs/BannerImages/spinner-grey-small.gif'},
	success: {url: 'http://philly311.phila.gov/admin/virtual/imgs/BannerImages/success.png'},
	error: {url: 'http://philly311.phila.gov/admin/virtual/imgs/BannerImages/error.png'}
};

$(document).ready(function() {
	// Ensure we're modifying at a service request of one of the proper templates
	if(window.location.pathname == PATH_NAME && valueInObject($(NODES.template).val(), TEMPLATES) != -1) {
		// Add verify button & icons to template
		var verify_button = $('<button/>').text('Verify').addClass('button').css('cursor', 'pointer');
		ICONS.spinner.node = $('<img/>').attr('src', ICONS.spinner.url).css('vertical-align', 'middle').hide();
		ICONS.success.node = $('<img/>').attr('src', ICONS.success.url).css('vertical-align', 'middle').hide();
		ICONS.error.node = $('<img/>').attr('src', ICONS.error.url).css('vertical-align', 'middle').hide();
		
		// Add icons and verify button after the address field
		$(NODES.input_address).after(ICONS.error.node).after(ICONS.success.node).after(ICONS.spinner.node).after(verify_button);
		
		// Shrink address field so verify button fits (must be after verify_button is added to DOM to get its width)
		$(NODES.input_address).width($(NODES.input_address).width() - verify_button.width() - 26);
		
		// Verify button functionality
		verify_button.click(function(e) {
			e.preventDefault(); // Cancel normal click action
			var department = $(NODES.department).val();
			var category = $(NODES.category).val();
			var input_address = $.trim($(NODES.input_address).val());
			
			// If address field is empty
			if( ! input_address) {
				alert('Please provide an address to verify');
			}
			// If address includes override key, override verification and mark verified
			else if(input_address.indexOf(OVERRIDE_STRING) != -1) {
				set_icon('success');
				reset('override');
				$(NODES.input_address).val(input_address.replace(OVERRIDE_STRING, '')); // Remove override string (wildcard)
			}
			// If department or category not selected
			else if( (! department || department == '_null' || ! category || category == '0') && $(NODES.template).val() != TEMPLATES.smoke_alarm) {
				alert('Please select a Category and Department before verifying the address');
			}
			// Otherwise run address verification
			else {
				ulrs311.reset(); // Reset results array
				set_icon('spinner'); // Show loading icon
				// If department is L&I or category is vacant lot, use L&I address format
				if(department == NODE_VALUES.department_li || category == NODE_VALUES.category_vacant_lot) {
					var unit = input_address.match(/ UNIT: \d+$/); // Detect " UNIT: ##"
					if(unit && unit.length) { // If unit number is in the address string, remove it and store it to be appended after verification
						unit = unit[0];
						input_address = input_address.substr(0, input_address.length - unit.length);
					}
					ulrs311.liaddress(input_address, check_results, unit);
					ulrs311.location(input_address, ['xy'], check_results, 'LI');
					ulrs311.service_areas(input_address, check_results);
				}
				// If department is Streets, use SnapNearCenterline
				else if(department == NODE_VALUES.department_streets) {
					ulrs311.location(input_address, ['xy', 'standardized_address'], check_results, 'Streets');
					ulrs311.service_areas(input_address, check_results);
				}
				// For everything else
				else {
					ulrs311.location(input_address, ['xy', 'standardized_address'], check_results);
					ulrs311.service_areas(input_address, check_results);
				}
			}
		}).hover(function() {
			// Add Novo UI highlight functionality
			$(this).toggleClass('buttonhover');
		});
		
		// If address, department, or category changes, mark unverified
		$(NODES.input_address).add(NODES.department).add(NODES.category).change(function() {
			if($(NODES.verified).val()) {
				reset();
				set_icon();
			}
		});
		
		// Hide secret fields
		$(NODES.verified).add(NODES.xcoord).add(NODES.ycoord).add(NODES.label_verified).add(NODES.label_xcoord).add(NODES.label_ycoord).hide();
		
		// If address is already verified (ex. viewing existing ticket), show success icon
		if($(NODES.verified).val() != TABLES.verified['default']) {
			set_icon('success');
		}
	}
});

// Callback function - called every time a request completes/fails, to check if all the requests have been made (even if some failed)
function check_results(calledby) {
	// Check that standardized_address, x/y, & service areas requests have been completed (if not, it still waiting)
	if( ! ulrs311.results.hasOwnProperty('standardized_address') || ! ulrs311.results.hasOwnProperty('xcoord') 
	|| ! ulrs311.results.hasOwnProperty('ycoord') || ! ulrs311.results.hasOwnProperty('service_areas')) {
		if(DEBUG) console.log('check_results('+calledby+') Not Completed Yet');
		return;
	}
	if(DEBUG) console.log('check_results('+calledby+') Completed');
	
	// We'll arrive here only if all the requests have completed (though they may have errors, in which case they'll be null)
	// Now check if required field(s) were fetched successfully
	if(ulrs311.results.standardized_address) {
		// Fill in the form with the fetched values
		$(NODES.standardized_address).val(ulrs311.results.standardized_address);
		$(NODES.xcoord).val(ulrs311.results.xcoord);
		$(NODES.ycoord).val(ulrs311.results.ycoord);
		set_service_areas(ulrs311.results.service_areas);
		
		// Set verified to true
		set_verified(true);
		set_icon('success');
	}
	// Otherwise clear the form
	else {
		if(DEBUG) console.log('Resetting');
		reset();
		set_icon('error');
	}
}

// Accepts: true, false, 'override', 'down', <empty>
function set_verified(status) {
	var key;
	if(status === true) {
		key = TABLES.verified['verified'];
	}
	else if(status && status in TABLES.verified) {
		key = TABLES.verified[status];
	}
	else {
		key = TABLES.verified['default'];
	}
	$(NODES.verified).val(key);
}

function set_service_areas(values) {
	$.each(SERVICE_AREAS, function(key, val) {
		if($.isPlainObject(values) && val.id in values && typeof values[val.id] == 'string') {
			$(val.node).val(val.table[values[val.id]]);
		}
		else {
			$(val.node).val(val.table['default']);
		}
	});
}

function set_icon(icon) {
	if(icon == 'spinner') $(ICONS.spinner.node).show();
	else $(ICONS.spinner.node).hide();
	
	if(icon == 'success') $(ICONS.success.node).show();
	else $(ICONS.success.node).hide();
	
	if(icon == 'error') $(ICONS.error.node).show();
	else $(ICONS.error.node).hide();
}

function reset(verified) {
	$(NODES.xCoord).val(''); // Reset longitude
	$(NODES.yCoord).val(''); // Reset latitude
	set_service_areas(); // Reset service areas
	set_verified(verified ? verified : false); // Reset verified
}

function valueInObject(needle, haystack) {
	for(i in haystack) {
		if(haystack[i] == needle) return i;
	}
	return -1;
}