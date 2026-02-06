<?php
if (!defined('ABSPATH')) exit;

$placeholder = isset($attributes['placeholder']) ? esc_attr($attributes['placeholder']) : 'Search…';

// Print the SVG goo filter ONCE per page
static $printed = false;
if (!$printed) { $printed = true; ?>
  <svg aria-hidden="true" width="0" height="0" style="position:absolute">
    <defs>
      <filter id="gooey-search-goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
        <feColorMatrix in="blur" type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -10"
          result="goo"/>
        <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
      </filter>
    </defs>
  </svg>
<?php } ?>

<section class="gooey-search-block site-container-custom">
  <!-- Native (JS-off) lookalike -->
  <form class="gooey-search__native" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <div class="gooey-search__wrap is-native" style="filter:url(#gooey-search-goo)">
      <div class="gooey-search__field">
        <input
          id="s-native"
          class="gooey-search__input"
          type="search"
          name="s"
          placeholder="<?php echo esc_attr( $placeholder ); ?>"
          autocomplete="off"
          aria-label="Search"
          value=""
        />

        <!-- Static goo layer (no animations, still “goo”s) -->
        <div class="gooey-search__ink" aria-hidden="true">
          <span class="gooey-search__surface"></span>
          <span class="gooey-search__lens"></span>
          <span class="gooey-search__handle"></span>
        </div>

        <!-- Submit button (visible in no-JS, same icon) -->
        <button type="submit" class="gooey-search__icon" aria-label="Search">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7"></circle>
            <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
          </svg>
        </button>
      </div>
    </div>
    <label class="screen-reader-text" for="s-native">Search for:</label>
  </form>

  <!-- React mount (progressive enhancement) -->
  <div class="js-gooey-search" data-placeholder="<?php echo $placeholder; ?>"></div>
</section>