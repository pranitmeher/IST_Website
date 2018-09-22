// Project 2 : Recreation of www.ist.rit.edu with jQuery
// Author: Pranit Meher <pxm3417@rit.edu>
// This file contains all the functions necessary for the file named index.html

// ********************************************************************************************************************
var map;
jQuery(document).ready(function($){

    make_search_box();
	var mainHeader = $('.header_rit'),
		secondaryNavigation = $('.same_page_navigator'),
		//this applies only if secondary nav is below intro section
		belowNavHeroContent = $('.sub-nav-hero'),
		headerHeight = mainHeader.height();

	//set scrolling variables
	var scrolling = false,
		previousTop = 0,
		currentTop = 0,
		scrollDelta = 10,
		scrollOffset = 150;

	mainHeader.on('click', '.nav-trigger', function(event){
		// open primary navigation on mobile
		event.preventDefault();
		mainHeader.toggleClass('nav-open');
	});

	// Change Same Page Navigator tabs
    $('.change_me').on("click",function () {
        $('.active').removeClass("active");
        $(this).addClass("active");
    });

    var $root = $('html, body');

    $('a[href^="#"]').click(function () {
        $root.animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 700);

        return false;
    });

	$(window).on('scroll', function(){
		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame)
				? setTimeout(autoHideHeader, 250)
				: requestAnimationFrame(autoHideHeader);
		}
	});

	$(window).on('resize', function(){
		headerHeight = mainHeader.height();
	});

	function autoHideHeader() {
		var currentTop = $(window).scrollTop();

		( belowNavHeroContent.length > 0 )
			? checkStickyNavigation(currentTop) // secondary navigation below intro
			: checkSimpleNavigation(currentTop);

	   	previousTop = currentTop;
		scrolling = false;
	}

	function checkSimpleNavigation(currentTop) {
		//there's no secondary nav or secondary nav is below primary nav
	    if (previousTop - currentTop > scrollDelta) {
	    	//if scrolling up...
	    	mainHeader.removeClass('is-hidden');
	    } else if( currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
	    	//if scrolling down...
	    	mainHeader.addClass('is-hidden');
	    }
	}

	function checkStickyNavigation(currentTop) {
		//secondary nav below intro section - sticky secondary nav
		var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height() - mainHeader.height();

		if (previousTop >= currentTop ) {
	    	//if scrolling up...
	    	if( currentTop < secondaryNavOffsetTop ) {
	    		//secondary nav is not fixed
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.removeClass('fixed slide-up');
	    		belowNavHeroContent.removeClass('secondary-nav-fixed');
	    	} else if( previousTop - currentTop > scrollDelta ) {
	    		//secondary nav is fixed
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.removeClass('slide-up').addClass('fixed');
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    	}

	    } else {
	    	//if scrolling down...
	 	  	if( currentTop > secondaryNavOffsetTop + scrollOffset ) {
	 	  		//hide primary nav
	    		mainHeader.addClass('is-hidden');
	    		secondaryNavigation.addClass('fixed slide-up');
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    	} else if( currentTop > secondaryNavOffsetTop ) {
	    		//once the secondary nav is fixed, do not hide primary nav if you haven't scrolled more than scrollOffset
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.addClass('fixed').removeClass('slide-up');
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    	}

	    }
	}
});

// General function to fetch data
// ***********************************************************
function xhr(getOrPost, d, pId){
    return $.ajax({
        type:getOrPost,
        url:'connection/proxy.php',
        cache:false,
        async:true,
        dataType:'json',
        data:d,
        beforeSend:function(){
            //put out a spinner if pId is defined...
            $(pId).append('<img src="assets/gears.gif" class="funkyThing"/>');
        }
    }).always(function(){
        //kill the spinner...
        $(pId).find('.funkyThing').fadeOut(500,function(){
            $(this).remove();
        });
    }).fail(function(err){
        console.log(err);
    }); //note - no done!
}
// ***********************************************************

// Getting data for  ABOUT
// ***********************************************************
var var_get_about = function get_about() {
    console.log("printing about");
    xhr('get',{path:'/about/'},'').done(function(json){
        var tag_about = $('#div_about');
        tag_about.append("<h1 class = 'about_title'>"+json.title+"</h1>");
        tag_about.append(("<hr class = 'about_hr'>"));
        tag_about.append("<br>");
        tag_about.append("<p class = about_description>"+json.description+"</p>");
        // tag_about.append("<br><br>");
        tag_about.append("<i class='fas fa-quote-left' style='color:#F36E21;float: left;margin-left:10%; font-size:" +
            " xx-large'></i>");
        tag_about.append("<i class='fas fa-quote-right' style='color: #F36E21;float:" +
            "  right;margin-right:10%;font-size: xx-large'></i>");
        tag_about.append("<p class = 'about_quote'>"+json.quote+"</p>");
        // tag_about.append("<br><br>");
        tag_about.append("<p class = 'about_quote_author'>~"+json.quoteAuthor+"</p>");

    });

};
// ***********************************************************

// Getting data for  Undergrad Degrees
// ***********************************************************
var var_get_degree_undergrad = function get_degree_undergrad() {
    console.log("printing ug_degrees");
    xhr('get',{path:'/degrees/'},'').done(function(json){
        var tag_undergrad_degree = $('#div_undergrad_degree');
        var tag_undergrad_degree_type_1 = $('#undergrad_degree_div_types_1');
        var tag_undergrad_degree_type_2 = $('#undergrad_degree_div_types_2');
        var tag_undergrad_degree_type_3 = $('#undergrad_degree_div_types_3');
        var list_types = [tag_undergrad_degree_type_1,tag_undergrad_degree_type_2,tag_undergrad_degree_type_3];
        // var json_list = [];

        // tag_undergrad_degree.append("UNDERGRAD DEGREE<br>");

        // Adding icons
        tag_undergrad_degree_type_1.append("<i class=\"fas fa-globe fa-5x\"style='color:#2348DE; padding: 5px'></i> ");
        tag_undergrad_degree_type_2.append("<i class=\"far fa-hand-paper fa-5x\"style='color:#DE7E23;padding:" +
            " 5px'></i> ");
        tag_undergrad_degree_type_3.append("<i class=\"fas fa-laptop fa-5x\"style='color:#DE2323;padding: 5px'></i> ");

        $.each(json.undergraduate, function(i, item){

            // degree title
            list_types[i].append("<p class = 'undergrad_degree_type_title'>"+item.title+"</p>");
            //degree description
            list_types[i].append("<p class = 'undergrad_degree_type_description'>"+item.description+"</p>");

            // //appending concentrations
            // json_list.push(item.concentrations);
        });

        // Adding icons
        tag_undergrad_degree_type_1.append("<i class=\"fas fa-plus-circle fa-2x\" style='color:#7C7C7C;" +
            " padding:3px' id = 'undergraduate_degree_enlarge_icon_1'></i> ");
        tag_undergrad_degree_type_2.append("<i class=\"fas fa-plus-circle fa-2x\"" +
            " style='color:#7C7C7C;padding:3px' id = 'undergraduate_degree_enlarge_icon_2'></i>");
        tag_undergrad_degree_type_3.append("<i class=\"fas fa-plus-circle fa-2x\"" +
            " style='color:#7C7C7C;padding:3px' id = 'undergraduate_degree_enlarge_icon_3'></i> ");

        // Click here to find out more
        tag_undergrad_degree_type_1.append("<h4 style='color:#7C7C7C;padding-top:5px'> Click to find out more</h4> ");
        tag_undergrad_degree_type_2.append("<h4 style='color:#7C7C7C;padding-top:5px'> Click to find out more</h4> ");
        tag_undergrad_degree_type_3.append("<h4 style='color:#7C7C7C;padding-top:5px'> Click to find out more</h4> ");


        // adding on mouse over
        var currentSize =  parseFloat($('.undergrad_degree_type_title').css('font-size'));
        var newSize = currentSize * 1.1;

        tag_undergrad_degree_type_1.hover(function () {change_colors(tag_undergrad_degree_type_1,currentSize,newSize);},
            function () {revert_colors(tag_undergrad_degree_type_1,currentSize,newSize);});

        tag_undergrad_degree_type_2.hover(function () {change_colors(tag_undergrad_degree_type_2,currentSize,newSize);},
            function () {revert_colors(tag_undergrad_degree_type_2,currentSize,newSize);});

        tag_undergrad_degree_type_3.hover(function () {change_colors(tag_undergrad_degree_type_3,currentSize,newSize);},
            function () {revert_colors(tag_undergrad_degree_type_3,currentSize,newSize);});


        // Adding on click
        tag_undergrad_degree_type_1.on("click",function (){create_modal(tag_undergrad_degree_type_1,json.undergraduate[0]);});
        tag_undergrad_degree_type_2.on("click",function (){create_modal(tag_undergrad_degree_type_2,json.undergraduate[1]);});
        tag_undergrad_degree_type_3.on("click",function (){create_modal(tag_undergrad_degree_type_3,json.undergraduate[2]);});

    });


};
// ***********************************************************

// Getting data for  GRAD Degrees
// ***********************************************************
var var_get_degree_grad = function get_degree_grad() {
    console.log("printing degrees_grad");
    xhr('get',{path:'/degrees/'},'').done(function(json){
        var tag_grad_degree = $('#div_grad_degree');

        var tag_grad_degree_type_1 = $('#grad_degree_div_types_1');
        var tag_grad_degree_type_2 = $('#grad_degree_div_types_2');
        var tag_grad_degree_type_3 = $('#grad_degree_div_types_3');
        var list_types = [tag_grad_degree_type_1,tag_grad_degree_type_2,tag_grad_degree_type_3];
        // var json_list = [];


        // Adding icons
        tag_grad_degree_type_1.append("<i class=\"far fa-keyboard fa-5x\"style='color:#FFFFFF; padding: 3px'></i> ");
        tag_grad_degree_type_2.append("<i class=\"fas fa-desktop fa-5x\"style='color:#FFF000;padding:" +
            " 3px'></i> ");
        tag_grad_degree_type_3.append("<i class=\"fas fa-hdd fa-5x\"style='color:#F94A17;padding: 3px'></i> ");

        for(var i = 0; i < list_types.length; i++){
            var item = json.graduate[i];
            // degree title
            list_types[i].append("<p class = 'grad_degree_type_title'>"+item.title+"</p>");
            //degree description
            list_types[i].append("<p class = 'grad_degree_type_description'>"+item.description+"</p>");

            //appending concentrations
            // json_list.push(item.concentrations);
        };

        // Adding icons
        tag_grad_degree_type_1.append("<i class=\"fas fa-plus-circle fa-2x\" style='color:#7C7C7C;" +
            " padding:5px' id = 'graduate_degree_enlarge_icon_1'></i> ");
        tag_grad_degree_type_2.append("<i class=\"fas fa-plus-circle fa-2x\"" +
            " style='color:#7C7C7C;padding:5px' id = 'graduate_degree_enlarge_icon_2'></i>");
        tag_grad_degree_type_3.append("<i class=\"fas fa-plus-circle fa-2x\"" +
            " style='color:#7C7C7C;padding:5px' id = 'graduate_degree_enlarge_icon_3'></i> ");

        // Click here to find out more
        tag_grad_degree_type_1.append("<h4 style='color:#7C7C7C;padding-top:5px'> Click to find out more</h4> ");
        tag_grad_degree_type_2.append("<h4 style='color:#7C7C7C;padding-top:5px'> Click to find out more</h4> ");
        tag_grad_degree_type_3.append("<h4 style='color:#7C7C7C;padding-top:5px'> Click to find out more</h4> ");


        // adding on mouse over
        var currentSize =  parseFloat($('.grad_degree_type_title').css('font-size'));
        var newSize = currentSize * 1.1;

        tag_grad_degree_type_1.hover(function () {change_colors(tag_grad_degree_type_1,currentSize,newSize);},
            function () {revert_colors(tag_grad_degree_type_1,currentSize,newSize);});

        tag_grad_degree_type_2.hover(function () {change_colors(tag_grad_degree_type_2,currentSize,newSize);},
            function () {revert_colors(tag_grad_degree_type_2,currentSize,newSize);});

        tag_grad_degree_type_3.hover(function () {change_colors(tag_grad_degree_type_3,currentSize,newSize);},
            function () {revert_colors(tag_grad_degree_type_3,currentSize,newSize);});


        // Adding on click
        tag_grad_degree_type_1.on("click",function (){create_modal(tag_grad_degree_type_1,json.graduate[0]);});
        tag_grad_degree_type_2.on("click",function (){create_modal(tag_grad_degree_type_2,json.graduate[1]);});
        tag_grad_degree_type_3.on("click",function (){create_modal(tag_grad_degree_type_3,json.graduate[2]);});

        // Certificates
        tag_grad_degree.append("<div class = 'div_grad_degree_certificate'></div>");
        tag_grad_degree.append("<hr class = 'div_grad_degree_hr'>");
        tag_grad_degree.append("<h1 class = 'div_grad_degree_title'>Our Graduate Advanced Certificates</h1>");
        tag_grad_degree.append("<a href='http://www.rit.edu/programs/web-development-adv-cert' target='_blank'><div id =" +
            " 'div_grad_degree_cert_one'></div></a>");
        $('#div_grad_degree_cert_one').append("<i class=\"fab fa-html5 fa-3x\" style='color: orange'></i>");
        $('#div_grad_degree_cert_one').append("<p class= 'div_grad_degree_cert'>"+json.graduate[3].availableCertificates[0]+"</p>");

        tag_grad_degree.append("<a href='http://www.rit.edu/programs/networking-planning-and-design-adv-cert' target='_blank'><div id =" +
            " 'div_grad_degree_cert_two'></div></a>");
        $('#div_grad_degree_cert_two').append("<i class=\"fas fa-certificate fa-3x\" style='color: lightblue'></i>");
        $('#div_grad_degree_cert_two').append("<p class= 'div_grad_degree_cert'>"+json.graduate[3].availableCertificates[1]+"</p>");


    });
};
// ***********************************************************

// Supporting functions for undergrad and grad degrees
// ***********************************************************
// Change colors on mouse hover
function change_colors(elem,currentSize,newSize) {
    elem.children().eq(1).animate({fontSize:newSize},200);
    elem.children().eq(3).css('color',elem.children().eq(0).css('color'));
}
// Revert colors on mouse hover
function revert_colors(elem,currentSize,newSize) {
    elem.children().eq(1).animate({fontSize:currentSize},200);
    elem.children().eq(3).css('color','');
}

// create modal
function create_modal(elem,json_obj) {

    var put_in = $('#modal_div');
    put_in.append("<p class = 'modal_div_title'>"+json_obj.title+ "</p>");

    put_in.append("<p class = 'model_div_conc'>Concentrations</p>");
    put_in.append("<hr class = 'model_div_hr'>");

    // Concentrations
    for(var i = 0; i < json_obj.concentrations.length; i++){
        put_in.append("<p class = 'model_div_conc_val'>"+json_obj.concentrations[i]+"</p>");
    }

    // Learn More
    put_in.append("<p class = 'model_div_learn'>To learn more about this degree, visit our website</p>");
    put_in.append("<i class=\"fas fa-globe fa-1x\"style='color:red; padding: 2px'></i> ");
    var link = "http://"+json_obj.degreeName+'.rit.edu';
    put_in.append("<a href="+link+"  class = 'model_div_learn' target = '_blank'>"+link+"</a>");

    put_in.dialog({
        modal: true,
        beforeClose: function () {put_in.empty();},
        minHeight:500,
        minWidth:600,
        closeOnEscape: true
    });
}
// ***********************************************************

// Getting data for  MINORS
// ***********************************************************
var var_get_minors = function get_minors() {
    console.log("printing minors");
    xhr('get',{path:'/minors/'},'').done(function(json){

        var tag_undergrad_minors = $('#div_undergrad_minor');

        tag_undergrad_minors.append("<p class='undergrad_degree_minors_expand'>Expand your field of study</p>");

        tag_undergrad_minors.append("<div class='tag_undergrad_minors_row1' id = 'tag_undergrad_minors_row1'></div>");
        tag_undergrad_minors.append("<div class='tag_undergrad_minors_row2' id = 'tag_undergrad_minors_row2'></div>");

        var tag_undergrad_minors_row1 = $('#tag_undergrad_minors_row1');
        var tag_undergrad_minors_row2 = $('#tag_undergrad_minors_row2');

        // Calling function to make divs

        // colors for divs boxes
        var minor_colors = ['#1A1919','#0C00FF','#6D6D6D','#FF8300','#00AD12','#2D0505','#A24CE2','#C87878'];
        var minor_icons = ['fas fa-database','fas fa-map-marker','fas fa-heartbeat','fas fa-mobile','fas fa-mobile-alt','fas fa-exclamation-circle','fas fa-globe','fas fa-pencil-alt'];

        $.each(json.UgMinors, function(i, item){
            if(i<4){
                make_divs_undergrad_minors(tag_undergrad_minors_row1,item,minor_colors[i],minor_icons[i]);
            }
            else if(i<8){
                make_divs_undergrad_minors(tag_undergrad_minors_row2,item,minor_colors[i],minor_icons[i]);
            }

        });

    });

    // adding data for divs in UG Minors
    // ____________________________________________________________________________________
    function make_divs_undergrad_minors(tag_undergrad_minors_row,ugminors,div_bg,div_icon){
        //making div for a minor

        $div_to_append = $("<div class='tag_undergrad_minors_for_minor' style='background:"+div_bg+"'><i" +
             " class='"+div_icon+" fa-4x' style='color:white; margin-top: 30px'></i></div>");

        $div_to_append.append("<p class='tag_undergrad_minors_for_minor_title'>"+ugminors.title+"</p>");

        $div_to_append.on("click",function () {
           create_modal_minors(this,ugminors);
        });
        // div box
        tag_undergrad_minors_row.append($div_to_append);

    }

    // Create modal for ugminors
    function create_modal_minors(elem, json_obj) {

        var put_in = $('#modal_div');
        put_in.append("<p class = 'ugminors_modal_div_title'>Minor: "+json_obj.title+ "</p>");

        var str_desc = json_obj.description.split(".");

        // for generating description again
        var desc = '';
       for(var i = 0; i < str_desc.length -2;i++){
           if(i == 0){
               desc = str_desc[i];
           }else{
               desc = desc + ". "+ str_desc[i];
           }

           if(i == str_desc.length-3){
               desc = desc + ".";
           }
        }

        put_in.append("<p class = 'ugminors_modal_div_description'>"+desc+"</p>");

        put_in.append("<p class = 'ugminors_modal_div_fac'>"+str_desc[str_desc.length-2]+"</p>");
        put_in.append("<p class = 'ugminors_modal_div_fac'>"+str_desc[str_desc.length-1]+"</p>");
        put_in.append("<div class='ugminors_modal_div_div_span'><span class =" +
            " 'ugminors_modal_div_span'>Courses</span></div>");

         $put_in_before = $("<div class = 'accordian_div'></divclass>");

        // var json_obj_more_data = get_name_desc();
        //console.log(json_obj_more_data);

        // add courses
       $.each(json_obj.courses, function(i, item){
           $h3_add = $("<h3 class = 'ugminors_modal_div_course'>"+item+"</h3>");


           $div_add_div = $("<div class='ugminors_modal_div_course_div'></div>");

           get_name_desc($div_add_div,item);


           $put_in_before.append($h3_add);
           $put_in_before.append($div_add_div);

       });


        $put_in_before.accordion({"refresh":"true","heightStyle": "content", "collapsible":"true"});

        put_in.append($put_in_before);
        put_in.append("<p class = 'ugminors_modal_div_note'>"+json_obj.note+"</p>");

        put_in.dialog({
            modal: true,
            beforeClose: function () {put_in.empty();},
            height:500,
            width:850,
            // maxHeight:600,
            // maxWidth:800,
            closeOnEscape: true
        });
    }


    function get_name_desc(elem,course_name) {
         xhr('get',{path:'/course/courseID='+course_name},'').done(function(json_ret){

             elem.append("<p class = 'ugminors_modal_div_course_modal_title'>"+json_ret.courseID+ ": " + json_ret.title+"</p>");
             elem.append("<p class = 'ugminors_modal_div_course_modal_desc'>"+json_ret.description+ "</p>");

        });
    }
};
// ***********************************************************


// Getting data for  EMPLOYMENT
// ***********************************************************
var var_get_employment = function get_employment() {
    console.log("printing employment");
    var tag_grad_degree = $('#div_employment');
    var minor_colors = ['#1A1919','#0C00FF','#6D6D6D','#FF8300','#00AD12','#2D0505','#A24CE2','#C87878'];
    xhr('get',{path:'/employment/introduction'},'').done(function(json){


        tag_grad_degree.append("<p class = 'div_employment_title'>"+json.introduction.title+"</p>");

        // title and description
        for(var i = 0; i < 2; i++){
            tag_grad_degree.append("<p class = 'div_employment_employment_content'>"+json.introduction.content[i].title+"</p>");
            tag_grad_degree.append("<hr class = 'div_employment_hr'>");
            tag_grad_degree.append("<p class = 'div_employment_employment_desc'>"+json.introduction.content[i].description+"</p>");

        }



    });

    // Degree Stats
    // stats
    $tag_grad_degree_div_append = $("<div class = 'div_employment_div_stats'></div>");

    xhr('get',{path:'/employment/degreeStatistics'},'').done(function(json){
        for(var i = 0; i < json.degreeStatistics.statistics.length; i++){
            $tag_grad_degree_div_append.append("<div class = 'div_employment_div_stats_div' style='background: "+minor_colors[i+2]+"'> <p class" +
                " ='div_employment_div_stats_val'>"
                +json.degreeStatistics.statistics[i].value+"</p><p class='div_employment_div_stats_text'>"+json.degreeStatistics.statistics[i].description+"</p></div>");
        }
        tag_grad_degree.append($tag_grad_degree_div_append);
    });

    // Employers
    xhr('get',{path:'/employment/employers'},'').done(function(json){

        tag_grad_degree.append("<p class = 'div_employment_emp_car'>"+json.employers.title+"</p>");
        tag_grad_degree.append("<hr class = 'div_employment_hr'>");

        $tag_div_employment_emp_car_append = $("<div class = 'div_employment_emp_car_div'></div>");

        // title and description
        for(var i = 0; i < json.employers.employerNames.length; i++){
            $tag_div_employment_emp_car_append.append("<h3 class = 'div_employment_emp_car_div_names'>"+json.employers.employerNames[i]+" </h3>");
        }

        tag_grad_degree.append($tag_div_employment_emp_car_append);
    });

    // Careers
    xhr('get',{path:'/employment/careers'},'').done(function(json){

        tag_grad_degree.append("<p class = 'div_employment_emp_car'>"+json.careers.title+"</p>");
        tag_grad_degree.append("<hr class = 'div_employment_hr'>");

        $tag_div_employment_emp_car_append1 = $("<div class = 'div_employment_emp_car_div'></div>");

        // title and description
        for(var i = 0; i < json.careers.careerNames.length; i++){
            $tag_div_employment_emp_car_append1.append("<h3 class = 'div_employment_emp_car_div_names'>"+json.careers.careerNames[i]+" </h3>");
        }

        tag_grad_degree.append($tag_div_employment_emp_car_append1);
    });


};
// ***********************************************************

// Getting data for  Map sections
// ***********************************************************
var var_get_map = function get_map() {
    console.log("printing maps");

    var tag_map = $('#div_map');

    xhr('get',{path:'/location/'},'').done(function(json){

        // Add to Map
        $.each(json, function(i, item){
            // console.log(item.city);
            var infowindow = new google.maps.InfoWindow({
                content: '<p>'+item.city+'</p><p>'+item.state+'</p>'
            });

            var mark_at = {lat: parseFloat(item.latitude), lng: parseFloat(item.longitude)};
            var marker = new google.maps.Marker({
                position: mark_at,
                map: map,
                title: ''
            });
            marker.addListener('mouseover', function() {
                infowindow.open(map, this);
            });

            // assuming you also want to hide the infowindow when user mouses-out
            marker.addListener('mouseout', function() {
                infowindow.close();
            });
        });
    });

    //Co-op and Employment-Table
    $tag_div_map_both_tables = $("<div class = 'div_map_both_tables'></div>");

    $tag_div_map_table_coop = $("<div class='div_map_table' style='background: #D8433C'><h1 style='color:" +
        " white; font-size: 20px; text-align: center'>Co-op Table</h1></div>");

    $tag_div_map_table_emp = $("<div class='div_map_table' style='background: #3C62D8'><h1 style='color:" +
        " white; font-size: 20px; text-align: center'>Employment Table</h1></div>");


    $tag_div_map_table_coop.on("click",function () {
        make_modal_coop();
    });
    $tag_div_map_table_emp.on("click",function () {
        make_modal_emp();
    });

    $tag_div_map_both_tables.append($tag_div_map_table_coop);
    $tag_div_map_both_tables.append($tag_div_map_table_emp);

    tag_map.append($tag_div_map_both_tables);

};

// ***********************************************************

// Function to make map
// ***********************************************************
function make_map() {
    map = new google.maps.Map($('#div_map_add_map').get(0), {
        center: {lat: 41.850033, lng: -87.6500523},
        zoom: 3
    });
}

// ***********************************************************

// Functions to make modals
// ***********************************************************
function make_modal_coop() {

    $tag_div_map_table_coop_table_area = $('#modal_div');
    $tag_div_map_table_coop_table = $("<table id = 'coop_tab' style= 'width:100%'><thead><tr>" +
        "<th>Employer</th><th>Degree</th><th>City</th><th>Term</th></tr></thead><tbody></tbody></table>");

    xhr('get',{path:'/employment/coopTable/coopInformation'},'').done(function(json){

        console.log(json);

        $.each(json.coopInformation, function(i, item){
            $('#coop_tab').find('tbody').append("<tr><td>"+item.employer+"</td><td>"+item.degree+"</td>" +
                "<td>"+item.city+"</td><td>"+item.term+"</td></tr>");

        });

        $('#coop_tab').DataTable({
            beforeClose: function () {$tag_div_map_table_coop_table_area.empty();}
        });
    });
    $tag_div_map_table_coop_table_area.append($tag_div_map_table_coop_table);

    //var put_in = $('#modal_div');
    $tag_div_map_table_coop_table_area.dialog({
        modal: true,
        beforeClose: function () {$tag_div_map_table_coop_table_area.empty();},
        height:500,
        width:850,
        // maxHeight:600,
        // maxWidth:800,
        closeOnEscape: true
    });
}
function make_modal_emp() {

    $tag_div_map_table_emp_table_area = $('#modal_div');
    $tag_div_map_table_emp_table = $("<table id = 'emp_tab' style= 'width:100%'><thead><tr>" +
        "<th>Employer</th><th>Degree</th><th>City</th><th>Title</th><th>Start" +
        " Date</th></tr></thead><tbody></tbody></table>");

    xhr('get',{path:'/employment/employmentTable/professionalEmploymentInformation'},'').done(function(json){

        console.log(json);

        $.each(json.professionalEmploymentInformation, function(i, item){
            $('#emp_tab').find('tbody').append("<tr><td>"+item.employer+"</td><td>"+item.degree+"</td>" +
                "<td>"+item.city+"</td><td>"+item.title+"</td>><td>"+item.startDate+"</td></tr>");
        });

        $('#emp_tab').DataTable({
            beforeClose: function () {$tag_div_map_table_emp_table_area.empty();}
        });
    });
    $tag_div_map_table_emp_table_area.append($tag_div_map_table_emp_table);

    $tag_div_map_table_emp_table_area.dialog({
        modal: true,
        beforeClose: function () {$tag_div_map_table_emp_table_area.empty();},
        height:500,
        width:850,
        // maxHeight:600,
        // maxWidth:800,
        closeOnEscape: true
    });

}

// ***********************************************************

// Getting data for  People
// ***********************************************************
var var_get_people = function get_people(){
    console.log("printing people");
    //var tag_get_people = $('#div_people');
    $tag_div_people_fac = $('#div_people_fac');
    $tag_div_people_staff = $('#div_people_staff');

    xhr('get',{path:'/people/'},'').done(function(json){

        // For Faculty
        for(var i = 0; i < json.faculty.length; i++){

            $tag_div_people_fac.append("<div class='div_people_gridtabs_grid'>");

            for(var j = 0; j <4; j++){
                if((i+j) < json.faculty.length ){
                    $tag_div_people_fac_div = $("<div class='div_people_gridtabs_grid_cell'><p>"+json.faculty[i].name+"</p><h3>"+json.faculty[i].title+"</h3></div>");

                    take_this($tag_div_people_fac_div,json.faculty[i++]);

                    $tag_div_people_fac.append($tag_div_people_fac_div);
                }else{
                    break;
                }
            }
            $tag_div_people_fac.append("</div>");
        }

        // For Staff
        for(var i = 0; i < json.staff.length; i++){

            $tag_div_people_staff.append("<div class='div_people_gridtabs_grid'>");

            for(var j = 0; j <4; j++){
                if((i+j) < json.staff.length ){
                    $tag_div_people_staff_div = $("<div class='div_people_gridtabs_grid_cell'><p>"+json.staff[i].name+"</p><h3>"+json.staff[i].title+"</h3></div>");

                    take_this($tag_div_people_staff_div,json.staff[i++]);

                    $tag_div_people_staff.append($tag_div_people_staff_div);
                }else{
                    break;
                }
            }
            $tag_div_people_staff.append("</div>");
        }

    });





    $('#gridtab-1').gridtab({
        grid:2,
        tabPadding:5,
        keepOpen:false,
        borderWidth:4,
        tabBorderColor:'#66000000',
        contentBackground:'#66000000',
        contentBorderColor:'#66000000',
        activeTabBackground:'#66000000',
        contentPadding:30,
        config:{
            layout:'tab'
        }
    });

};
// ***********************************************************
// Creating modal for faculty and staff
// ***********************************************************
function create_modal_fac_staff(elem,json_data) {

    var put_in = $('#modal_div');

    $div_people_modal = $("<div class='div_people_modal_div'></div>");

    $div_people_modal.append("<h1 class = 'div_people_modal_name'>"+json_data.name+ "<h3" +
        " class='div_people_modal_title'></h3>"+json_data.title+"</h1><hr class='div_people_modal_hr'>");

    $div_people_modal_im = $("<div class='div_people_modal_image'></div>");
    $('<img src="'+ json_data.imagePath +'">').load(function() {
        $(this).width(130).height(150).appendTo($div_people_modal_im);
    });

    $div_people_modal.append($div_people_modal_im);

    $div_people_modal_cont = $("<div class='div_people_modal_contact'></div>");

    // adding contact info
    if(json_data.office != "" && json_data.office != null){
        $div_people_modal_cont.append("<p><i class='fas fa-map-marker fa-1x'></i><h3" +
            " class='div_people_modal_contact_details'>"+json_data.office+"</h3></p>");
    }
    if(json_data.phone != "" && json_data.phone != null){
        $div_people_modal_cont.append("<p><i class='fas fa-phone fa-1x'></i><h3" +
            " class='div_people_modal_contact_details'>"+json_data.phone+"</h3></p>");
    }
    if(json_data.email != "" && json_data.email != null){
        $div_people_modal_cont.append("<p><i class='fas fa-envelope fa-1x'></i><h3" +
            " class='div_people_modal_contact_details'>"+json_data.email+"</h3></p>");
    }
    if(json_data.website != "" && json_data.website != null){
        $div_people_modal_cont.append("<p><i class='fas fa-globe fa-1x'></i><h3" +
            " class='div_people_modal_contact_details'><a href ="+json_data.website+" target = _blank>"+json_data.website+"</a></h3></p>");
    }
    if(json_data.twitter != "" && json_data.twitter != null){
        $div_people_modal_cont.append("<p><i class='fab fa-twitter fa-1x'></i><h3" +
            " class='div_people_modal_contact_details'>"+json_data.twitter+"</h3></p>");
    }
    if(json_data.facebook != "" && json_data.facebook != null){
        $div_people_modal_cont.append("<p><i class='fab fa-facebook-square fa-1x'></i><h3" +
            " class='div_people_modal_contact_details'>"+json_data.facebook+"</h3></p>");
    }

    $div_people_modal.append($div_people_modal_cont);


    put_in.append($div_people_modal);


    put_in.dialog({
        modal: true,
        beforeClose: function () {put_in.empty();},
        minHeight:300,
        minWidth:500,
        closeOnEscape: true
    });
}

function take_this(elem,dat) {
    elem.on("click",function () {
        create_modal_fac_staff(elem,dat);
    });
}
// ***********************************************************

// Getting Faculty Research
// ***********************************************************
var var_get_fac_research = function get_fac_research(){


    console.log("printing fac research");
    $tag_div_fac_research_interest = $("#div_faculty_research_interest");
    $tag_div_fac_research_fac = $('#div_faculty_research_fac');

    xhr('get',{path:'/research/'},'').done(function(json){

        // For Interest
        for(var i = 0; i < json.byInterestArea.length; i++){

            $tag_div_fac_research_interest.append("<div class='div_faculty_research_gridtabs_grid'>");

            for(var j = 0; j <4; j++){
                if((i+j) < json.byInterestArea.length ){
                    $tag_div_fac_research_interest_div = $("<div class='div_faculty_research_gridtabs_cell'><p>"+json.byInterestArea[i].areaName+"</p></div>");

                    take_this_research($tag_div_fac_research_interest_div,json.byInterestArea[i++],0);

                    $tag_div_fac_research_interest.append($tag_div_fac_research_interest_div);
                }else{
                    break;
                }
            }
            $tag_div_fac_research_interest.append("</div>");
        }

        // For Faculty
        for(var i = 0; i < json.byFaculty.length; i++){

            $tag_div_fac_research_fac.append("<div class='div_faculty_research_gridtabs_grid'>");

            for(var j = 0; j <8; j++){
                if((i+j) < json.byFaculty.length ){
                    $tag_div_fac_research_fac_div = $("<div class='div_faculty_research_gridtabs_cell'><p>"+json.byFaculty[i].facultyName+"</p></div>");

                    take_this_research($tag_div_fac_research_fac_div,json.byFaculty[i++],1);

                    $tag_div_fac_research_fac.append($tag_div_fac_research_fac_div);
                }else{
                    break;
                }
            }
            $tag_div_fac_research_fac.append("</div>");
        }

    });

        $('#gridtab-2').gridtab({
            grid:2,
            tabPadding:5,
            keepOpen:false,
            borderWidth:4,
            tabBorderColor:'#66000000',
            contentBackground:'#66000000',
            contentBorderColor:'#66000000',
            activeTabBackground:'#66000000',
            contentPadding:30,
            config:{
                layout:'tab'
        }
    });

};
// ***********************************************************
// ***********************************************************
// Creating modal for faculty and staff
// ***********************************************************
function create_modal_research(elem,json_data,interest_or_fac) {

    var put_in = $('#modal_div');

    $div_research_modal = $("<div class='div_research_modal_div'></div>");

    if(interest_or_fac == 0){
        $div_research_modal.append("<h1 class = 'div_research_modal_name'>"+json_data.areaName+"</h1><hr" +
            " class='div_research_modal_hr'>");


    }
    else{
        $div_research_modal.append("<h1 class = 'div_research_modal_name'>"+json_data.facultyName+"</h1><hr" +
            " class='div_research_modal_hr'>");
    }

    $div_research_modal.append("<ul>");
    for(var i = 0; i < json_data.citations.length;i++){
        $div_research_modal.append("<li class='div_research_modal_li'>"+json_data.citations[i]+"</li>");
    }
    $div_research_modal.append("</ul>");

    put_in.append($div_research_modal);


    put_in.dialog({
        modal: true,
        beforeClose: function () {put_in.empty();},
        maxHeight:500,
        minWidth:700,
        closeOnEscape: true
    });
}

function take_this_research(elem,dat,interest_or_fac) {
    elem.on("click",function () {
        create_modal_research(elem,dat,interest_or_fac);
    });
}
// ***********************************************************

// Getting Student Resouces
// ***********************************************************
var var_get_student_resources = function get_student_resources(){

    console.log("printing student resources");

    $tag_div_student_resources = $("#div_student_resources");

    xhr('get',{path:'/resources/'},'').done(function(json){

        $tag_div_student_resources_div_1 = $("<div class = 'div_student_resources_div'></div>");
        $tag_div_student_resources_div_2 = $("<div class = 'div_student_resources_div'></div>");

        $tag_div_student_resources_cell_coop = $("<div class = 'div_student_resources_div_cell'><h1" +
            " class='div_student_resources_div_cell_title' >"+json.coopEnrollment.title+"</h1></div>");

        $tag_div_student_resources_cell_study_abroad = $("<div class = 'div_student_resources_div_cell'><h1" +
            " class='div_student_resources_div_cell_title' >"+json.studyAbroad.title+"</h1></div>");

        $tag_div_student_resources_cell_student_services = $("<div class = 'div_student_resources_div_cell'><h1" +
            " class='div_student_resources_div_cell_title' >"+json.studentServices.title+"</h1></div>");

        $tag_div_student_resources_cell_tutors = $("<div class = 'div_student_resources_div_cell'><h1" +
            " class='div_student_resources_div_cell_title' >"+json.tutorsAndLabInformation.title+"</h1></div>");

        $tag_div_student_resources_cell_ambassadors = $("<div class = 'div_student_resources_div_cell'><h1" +
            " class='div_student_resources_div_cell_title' >"+json.studentAmbassadors.title+"</h1></div>");

        $tag_div_student_resources_cell_forms = $("<div class = 'div_student_resources_div_cell'><h1" +
            " class='div_student_resources_div_cell_title' >Forms</h1></div>");


        $tag_div_student_resources_div_1.append($tag_div_student_resources_cell_coop);
        $tag_div_student_resources_div_1.append($tag_div_student_resources_cell_study_abroad);
        $tag_div_student_resources_div_1.append($tag_div_student_resources_cell_student_services);
        $tag_div_student_resources_div_2.append($tag_div_student_resources_cell_tutors);
        $tag_div_student_resources_div_2.append($tag_div_student_resources_cell_ambassadors);
        $tag_div_student_resources_div_2.append($tag_div_student_resources_cell_forms);


        assign_click_event($tag_div_student_resources_cell_coop,json.coopEnrollment,1);
        assign_click_event($tag_div_student_resources_cell_study_abroad,json.studyAbroad,2);
        assign_click_event($tag_div_student_resources_cell_student_services,json.studentServices,3);
        assign_click_event($tag_div_student_resources_cell_tutors,json.tutorsAndLabInformation,4);
        assign_click_event($tag_div_student_resources_cell_ambassadors,json.studentAmbassadors,5);
        assign_click_event($tag_div_student_resources_cell_forms,json.forms,6);

        $tag_div_student_resources.append($tag_div_student_resources_div_1);
        $tag_div_student_resources.append($tag_div_student_resources_div_2);
    });
};

    // Assigning on clicks
    function assign_click_event (elem,json_dat,id) {
        elem.on("click",function () {
           create_modal_student_resources(json_dat,id);
        });
    }

    // creating modal
    function create_modal_student_resources(json_dat,which_resource) {

        var put_in = $('#modal_div');

        // console.log(json_dat);

        $div_resource_modal = $("<div class='div_resource_modal_div'></div>");

        // Adding Title
        if(which_resource == 6){    // forms
            $div_resource_modal.append("<h1 class = 'div_resource_modal_name'>Forms</h1>");
        }
        else { // all others
            $div_resource_modal.append("<h1 class = 'div_resource_modal_name'>"+json_dat.title+"</h1>");
        }

        // Adding content to modal
        if(which_resource == 1){ // Coop
            $div_to_add_coop = $("<div ></div>");

            $.each(json_dat.enrollmentInformationContent, function(i, item){
                $div_to_add_coop.append("<h1 class = 'div_stud_res_details_h1'>"+item.title+"</h1>");
                $div_to_add_coop.append("<p class = 'div_stud_res_details_desc'>"+item.description+"</p>");
            });
            $div_to_add_coop.append("<a href = '"+json_dat.RITJobZoneGuidelink+"' target='_blank'>Click here to view" +
                " the RIT Job Zone Guide</a>");
            $div_resource_modal.append($div_to_add_coop);

        }
        else if(which_resource ==2){ // Study Abroad

            $div_to_add_study_abroad = $("<div></div>");
            $div_to_add_study_abroad.append("<p class = 'div_stud_res_details_desc'>"+json_dat.description+"</p>");

            $.each(json_dat.places, function(i, item){
                $div_to_add_study_abroad.append("<h1 class = 'div_stud_res_details_h1'>"+item.nameOfPlace+"</h1>");
                $div_to_add_study_abroad.append("<p class = 'div_stud_res_details_desc'>"+item.description+"</p>");
            });

            $div_resource_modal.append($div_to_add_study_abroad);

        }
        else if(which_resource ==3){ // Student Services
            $div_to_add_student_service = $("<div></div>");

            // Academic Advisors
            $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_h1'>"+json_dat.academicAdvisors.title+"</h1>");
            $div_to_add_student_service.append("<p class = 'div_stud_res_details_desc'>"+json_dat.academicAdvisors.description+"</p>");

            $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_h1'>"+json_dat.academicAdvisors.faq.title+"</h1>");
            $div_to_add_student_service.append("<a href = '"+json_dat.academicAdvisors.faq.contentHref+"' target='_blank'>Click" +
                " Here" +
                " to view FAQ</a>");

            // Professional Advisors
            $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_h1'>"+json_dat.professonalAdvisors.title+"</h1>");

            $.each(json_dat.professonalAdvisors.advisorInformation, function(i, item){
                $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_name'>"+item.name+"</h1>");
                $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_desc'>"+item.department+"</h1>");
                $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_desc'>"+item.email+"</h1>");
                $div_to_add_student_service.append("<br>");
            });

            // Faculty Advisors
            $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_h1'>"+json_dat.facultyAdvisors.title+"</h1>");
            $div_to_add_student_service.append("<p class = 'div_stud_res_details_desc'>"+json_dat.facultyAdvisors.description+"</p>");

            // Minor Advising
            $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_h1'>"+json_dat.istMinorAdvising.title+"</h1>");
            $.each(json_dat.istMinorAdvising.minorAdvisorInformation, function(i, item){
                $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_name'>"+item.title+"</h1>");
                $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_desc'>"+item.advisor+"</h1>");
                $div_to_add_student_service.append("<h1 class = 'div_stud_res_details_desc'>"+item.email+"</h1>");
                $div_to_add_student_service.append("<br>");

            });

            $div_resource_modal.append($div_to_add_student_service);

        }
        else if(which_resource ==4){ // Tutoring
            $div_to_add_tutoring = $("<div></div>");

            $div_to_add_tutoring.append("<p class = 'div_stud_res_details_desc'>"+json_dat.description+"</p>");
            $div_to_add_tutoring.append("<a href = '"+json_dat.tutoringLabHoursLink+"' target='_blank'>Click here to view" +
                " the Tutoring Lab Hours</a>");

            $div_resource_modal.append($div_to_add_tutoring);

        }
        else if(which_resource ==5){ // Ambassadors

            $div_to_add_ambassadors = $("<div></div>");


            $('<img src="'+ json_dat.ambassadorsImageSource +'">').load(function() {
                $(this).width(180).height(150).appendTo($div_to_add_ambassadors);
            });

            $.each(json_dat.subSectionContent, function(i, item){
                $div_to_add_ambassadors.append("<h1 class = 'div_stud_res_details_name'>"+item.title+"</h1>");
                $div_to_add_ambassadors.append("<p class = 'div_stud_res_details_desc'>"+item.description+"</p>");
            });

            $div_to_add_ambassadors.append("<a href = '"+json_dat.applicationFormLink+"' target='_blank'>Click here " +
                " for the Application Form</a>");
            $div_to_add_ambassadors.append("<p class = 'div_stud_res_details_desc'>"+json_dat.note+"</p>");


            $div_resource_modal.append($div_to_add_ambassadors);
        }
        else if(which_resource ==6){ // Forms
            $div_to_add_form = $("<div></div>");

            $div_to_add_form.append("<h1 class = 'div_stud_res_details_h1'>Graduate Forms</h1>");


            // graduate Forms
            $.each(json_dat.graduateForms, function(i, item){
                $div_to_add_form.append("<h1 class = 'div_stud_res_details_name'>"+item.formName+"</h1>");
                $div_to_add_form.append("<a href = '"+json_dat.href+"' target='_blank'>Click here to download" +
                    " form (actual link not available so page wont load)</a>");
                $div_to_add_form.append("<br>");
                $div_to_add_form.append("<br>");
                $div_to_add_form.append("<br>");

            });

            $div_to_add_form.append("<h1 class = 'div_stud_res_details_h1'>Undergraduate Forms</h1>");
            $.each(json_dat.undergraduateForms, function(i, item){
                $div_to_add_form.append("<h1 class = 'div_stud_res_details_name'>"+item.formName+"</h1>");
                $div_to_add_form.append("<a href = '"+json_dat.href+"' target='_blank'>Click here to download" +
                    " form (actual link not available so page wont load)</a>");
                $div_to_add_form.append("<br>");
                $div_to_add_form.append("<br>");
                $div_to_add_form.append("<br>");

            });


            $div_resource_modal.append($div_to_add_form);

        }



        put_in.append($div_resource_modal);


        put_in.dialog({
            modal: true,
            beforeClose: function () {put_in.empty();},
            maxHeight:500,
            minWidth:700,
            closeOnEscape: true
        });
    }


// ***********************************************************


// Getting Student Resources
// ***********************************************************
var var_get_social = function get_social(){

    console.log("printing Social");
    $tag_div_social_div = $("#div_social");

    xhr('get',{path:'/footer/social'},'').done(function(json){

        json = json.social;
        $tag_div_social_div.append("<h1 style='margin: 10px'>"+json.tweet+"</h1><pstyle='margin: 10px'>by: "+json.by+"</p>");

        $tag_div_social_div.append("<a href='"+json.twitter+"' target='_blank' ><i class='fab fa-twitter" +
            " fa-3x' style='color: #5599ff'></i></a></p><p><a href='"+json.facebook+"' target='_blank' style='color: #5599ff' ><i" +
            " class='fab" +
            " fa-facebook-square" +
            " fa-3x'></i></a></p>");

    });


};
// ***********************************************************

// Getting Footer
// ***********************************************************
var var_get_footer = function get_footer(){

    console.log("printing Footer");
    $tag_div_footer_div = $("#div_footer");

    $tag_div_footer_div_compartment1 = $("<div class='div_footer_div_left'></div>");
    $tag_div_footer_div_compartment2 = $("<div class='div_footer_div_center'></div>");
    $tag_div_footer_div_compartment3 = $("<div class='div_footer_div_right'></div>");


    xhr('get',{path:'/footer/'},'').done(function(json){

       // QuickLinks
        $.each(json.quickLinks, function(i, item){
            $tag_div_footer_div_compartment1.append("<a href='"+item.href+"' target='_blank'><div" +
                " class='div_footer_div_left_items'><h1>"+item.title+"</h1><hr class='div_footer_div_left_hr'></div></a>");
        });

        // CopyRight
        $tag_div_footer_div_compartment2.append("<p class='div_footer_div_center_copy'>"+json.copyright.html+"</p>");

        // Add news
        $tag_div_footer_div_right_news = $("<h1 class ='div_footer_div_left_items'>News</h1><hr" +
            " class='div_footer_div_left_hr'> ");

        $tag_div_footer_div_right_contact_form = $("<h1 class ='div_footer_div_left_items'>Contact Us</h1><hr" +
            " class='div_footer_div_left_hr'> ");

        xhr('get',{path:'/news/'},'').done(function(json_1){
            assign_click_event_news($tag_div_footer_div_right_news,json_1.older,0);
        });

        assign_click_event_news($tag_div_footer_div_right_contact_form,json,1);

        $tag_div_footer_div_compartment3.append($tag_div_footer_div_right_news);
        $tag_div_footer_div_compartment3.append($tag_div_footer_div_right_contact_form);
    });

    $tag_div_footer_div.append($tag_div_footer_div_compartment1);
    $tag_div_footer_div.append($tag_div_footer_div_compartment2);
    $tag_div_footer_div.append($tag_div_footer_div_compartment3);

};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Assigning on clicks
function assign_click_event_news(elem,json_dat,news_or_contact) {
    if(news_or_contact == 0){
        elem.on("click",function () {
            make_modal_news(json_dat);
        });
    }else{
        elem.on("click",function () {
            make_modal_contact();
        });
    }

}

function make_modal_news(news_to_add) {
    var put_in = $('#modal_div');

    $div_news_modal = $("<div class='div_news_modal_div'></div>");

    $div_news_modal.append("<h1 class = 'div_news_modal_h1'>News</h1><hr>");

    $.each(news_to_add, function(i, item){
        $div_news_modal.append("<p class='div_news_modal_title'>"+item.title+"</p>");
        $div_news_modal.append("<p class='div_news_modal_date'>"+item.date+"</p><br>");
        $div_news_modal.append("<p class='div_news_modal_p'>"+item.description+"</p>");
        $div_news_modal.append("<hr class='div_news_modal_hr'><br>");
    });


    put_in.append($div_news_modal);


    put_in.dialog({
        modal: true,
        beforeClose: function () {put_in.empty();},
        maxHeight:600,
        minWidth:700,
        closeOnEscape: true
    });
}

function make_modal_contact() {
    var put_in = $('#modal_div');

    $div_cnt_modal = $("<iframe src='https://www.ist.rit.edu/api/contactForm/'></iframe>");

    put_in.append($div_cnt_modal);


    put_in.dialog({
        modal: true,
        beforeClose: function () {put_in.empty();},
        maxHeight:600,
        minWidth:700,
        closeOnEscape: true
    });
}
// ***********************************************************


// ***********************************************************
// Declarations and imports
var all_functions = {
    1:var_get_about,
    2:var_get_degree_undergrad,
    3:var_get_degree_grad,
    4:var_get_minors,
    5:var_get_employment,
    6:var_get_map,
    7:var_get_people,
    8:var_get_fac_research,
    9:var_get_student_resources,
    10:var_get_social,
    11:var_get_footer
};
var count = 1;
// ***********************************************************



// Things to do when document is ready
// ***********************************************************
$(document).ready(function() {

    // GET DATA ON SCROLL
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    fill_window();
    fill_window();

    // ON-SCROLL
    $(window).scroll(function(bindScroll){});
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
});
// ***********************************************************

// supporting function for onscroll
// ***********************************************************
function bindScroll(){
    if($(window).scrollTop() + $(window).height() > (Math.ceil($(document).height()*0.9))) {
        // $(window).unbind('scroll');
        fill_window();
    }
}
// ***********************************************************

// Fill window
// ***********************************************************
function fill_window() {
    var len_all_func = Object.keys(all_functions).length;
    if (count > len_all_func){
        return;
    }
    all_functions[count++]();
    $(window).bind('scroll', bindScroll);
}
// ***********************************************************

function make_search_box() {


    $("#sb_temp").keyup(function(event) {
        if (event.keyCode === 13) {
            //console.log($('#sb_temp'));
            { location='http://www.google.com/search?q=' + $('#sb_temp').val() +' site:*.rit.edu'}
        }
    });



}