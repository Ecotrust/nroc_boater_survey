Ext.namespace('gwst');

/*
    Class: gwst.settings
    
    Place all application level settings here including web service urls,
	various parameters, etc.  Third party overrides should go here too.
*/

gwst.settings = {	
    minimum_draw_zoom: 4,
    zoom_error_text: '<p class="help-win">For accuracy reasons, you must zoom in further before drawing on the map. Please zoom in and try again.</p>',    
    
    adminEmail: 'fish@ecotrust.org',
    step1text: '<b>1. Select one place you participated in the above activity during your last trip.  If this place is not in the lists below, skip to step two.</b>',
    zoomText: '',
    zoomImgText: '<img src="/media/img/help_nav.png"/>',
    navText: '<b>2. Use the navigation controls to zoom the map in and center it over the location of the activity.</b>',
    markerText: '<b>3. Place a marker on the map where the activity took place. Start by clicking the \'Add New Marker\' button on the map.</b>',
    polyDrawText: '<b>3. Draw the area on the map where the activity took place. Start by clicking the \'Draw New Area\' button on the map.</b>',
    markerImgText: '<img src="/media/img/help_point_steps.png">',
    polyImgText: '<img src="/media/img/help_draw_poly.png"/>',
    repeatPointText: '<b>4.Place markers on the rest of the locations you particpated in this activity on your last trip, repeating steps 1-3 as needed.  Click \'Continue\' when you are done.</b>',
    repeatPolyText: '<b>4.Draw the rest of the areas you particpated in this activity on your last trip, repeating steps 1-3 as needed.  Click \'Continue\' when you are done.</b>',
    cityComboText: 'Oregon coast towns',
    placeComboText: 'Places of interest (parks, beaches, etc.)',

	point_panel_one_instructions: '<h2>Instructions</h2><p>In this next step, you will <u>place markers</u> on a map where you participated in the following activity:</p>',
	point_panel_two_instructions: '<h3>Example</h3><img class="example-img" src="/media/img/help_point_intro.jpg"><p>If you are not able to complete this step for this activity you can skip to the next one.</p><p>Click the \'Continue\' button</p>',    
    poly_panel_one_instructions: '<h2>Instructions</h2><p>In this next step, you will <u>draw</u> on a map the areas where you participated in the following activity:</p>',
    poly_panel_two_instructions: '<h3>Example</h3><img class="example-img" src="/media/img/help_poly_intro.jpg"><p>If you are not able to complete the step for an activity you can skip to the next one.</p><p>Click the \'Continue\' button</p>',
    
    shape_error_text: '<p class="error_text"><b>There was a problem</b> <img class="vab-img" src="/media/img/exclamation.png"></p>',
    shape_self_overlap_text: '<p>Your area is not valid because it overlaps itself (example below).</p> <img class="invalid-image" src="/media/img/invalid_bowtie.png">',
    shape_other_overlap_text: '<p>Your new area overlaps one of your other areas. They are not allowed to do this.</p>  <p>If you have two that border each other, just draw the second one along the edge of the first as best as you can.</p><img class="invalid-image" src="/media/img/invalid_overlap.png">',
    invalid_poly_text: '<p>Your area is not valid because it either had less than 3 \'corners\' (the minimum required) or it crosses over itself (a bowtie shape is an example).</p>',    
    route_invalid_text: '<p>Your route is not valid because it only had one point.  You may have accidentally double-clicked and completed it before you were done.  Please try again and create at least two waypoints for your route.</p>',
    help_text: 'If you need help, call 732-263-5662, email <a href="mailto:ljordan@monmouth.edu">ljordan@monmouth.edu</a>, or refer to our <a target="_blank" href="/detailed_instructions">detailed instructions</a> page'
};

gwst.settings.urls = {
	shapes: '/draw/shapes/',
    status: '/draw/status/',
    check: '/draw/check/',
	shape_validate: '/draw/shape/validate/',
    demo: '/videos/demo',
    complete: '/complete/'
};

Ext.Ajax.timeout = 120000;