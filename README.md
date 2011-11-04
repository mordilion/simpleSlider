# simpleSlider - A jQuery-Plugin to create easy and simple image sliders
Version: 1.1.3

## Requirements
The simpleSlider needs minimum jQuery 1.4 to run without problems.

## Features

### Main-Features
* Create multiple instances of slider
* Public methods to slide forward or backward
* Many good effects
* Optional title to each image
* Complete CSS designable

### Effects
* Slide (Horizontal/Vertical)
* Overlay Slide (Horizontal/Vertical)
* Fade Slide (Horizontal/Vertical)
* BLind (Horizontal/Vertical)
* Fade
* Rain
* RainGrow
* RainRandom
* Slice Up/Down

## Usage
    <script type="text/javascript" src="javascripts/jquery.simpleSlider.js" />          # needed to use
    <script type="text/javascript" src="javascripts/jquery.simpleSlider.effects.js" />  # if you want more effects

    <script type="text/javascript">
        $(document).ready(function () {	
            $('#slider').simpleSlider({
                width: 640,
                height: 360
            });
        });	
    </script>
    
    ...
    
    <div id="slider">
        <ul>				
            <li>
                <img src="images/example/image_01.jpg" alt="Image 01" />
                <div>
                    <h3 style="margin-top: 0;">Image 01</h3>
                    <p>Some more Text</p>
                    <a href="http://www.link.com/" target="_blank">you can put Links into the title</a>
                </div>
            </li>
            <li>
                <img src="images/example/image_02.jpg" alt="Image 02" />
                <div>
                    <h3 style="margin-top: 0;">Image 02</h3>
                    <p>Extra Text</p>
                    <a href="http://www.link.com/" target="_blank">you can put Links into the title</a>
                </div>
            </li>
        </ul>
    </div>
