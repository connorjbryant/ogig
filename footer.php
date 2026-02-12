<!-- footer.php -->
<?php
// Footer ACF fields live on the "Site Settings" page (slug: site-settings)
$settings_page = get_page_by_path('site-settings');
$settings_id   = $settings_page ? (int) $settings_page->ID : 0;

$phone_display = $settings_id ? (string) get_field('phone_display', $settings_id) : '';
$phone_tel     = $settings_id ? (string) get_field('phone_tel', $settings_id) : '';
$email         = $settings_id ? (string) get_field('email', $settings_id) : '';
$hours         = $settings_id ? (string) get_field('hours', $settings_id) : '';
$address       = $settings_id ? (string) get_field('address', $settings_id) : '';

$about_text   = $settings_id ? (string) get_field('footer_about_text', $settings_id) : '';
$about_btn_t  = $settings_id ? (string) get_field('footer_about_button_text', $settings_id) : '';
$about_btn_u  = $settings_id ? (string) get_field('footer_about_button_url', $settings_id) : '';
$map_iframe   = $settings_id ? (string) get_field('footer_map_iframe', $settings_id) : '';
?>

<footer class="site-footer site-footer--indus" aria-labelledby="footer-heading">
  <h2 id="footer-heading" class="sr-only">Footer</h2>

  <!-- ===== Footer “Widgets” Area (Induscity look) ===== -->
  <section class="footer-widgets" aria-label="Footer content">
    <div class="site-container">
      <div class="footer-grid">

        <!-- Column 1: Logo + About + Button + Social -->
        <div class="footer-col footer-about">
          <div class="footer-brand">
            <?php if ( has_custom_logo() ) : ?>
              <div class="footer-logo"><?php the_custom_logo(); ?></div>
            <?php else: ?>
              <div class="footer-logo-text"><?php bloginfo('name'); ?></div>
            <?php endif; ?>
          </div>

          <?php if (!empty($about_text)) : ?>
            <p class="footer-about__text">
              <?php echo esc_html($about_text); ?>
            </p>
          <?php endif; ?>

          <?php if (!empty($about_btn_t) && !empty($about_btn_u)) : ?>
            <a class="footer-btn" href="<?php echo esc_url($about_btn_u); ?>">
              <?php echo esc_html($about_btn_t); ?>
            </a>
          <?php endif; ?>

          <div class="footer-social" aria-label="Social links">
            <?php
              // menu location: footer-social (you already use this)
              $locations = get_nav_menu_locations();
              if (isset($locations['footer-social']) && $locations['footer-social'] != 0) {
                $menu_id = $locations['footer-social'];
                $items = wp_get_nav_menu_items($menu_id);

                if ($items) {
                  foreach ($items as $item) {
                    $aria = !empty($item->attr_title) ? $item->attr_title : wp_strip_all_tags($item->title);
                    echo '<a href="' . esc_url($item->url) . '" aria-label="' . esc_attr($aria) . '">';
                    echo $item->title; // contains <i> icon markup
                    echo '</a>';
                  }
                }
              }
            ?>
          </div>
        </div>

        <!-- Column 2: Useful Links (Primary Menu) -->
        <nav class="footer-col footer-links" aria-label="Useful links">
          <h3 class="footer-title">Useful Links</h3>
          <div class="footer-links__list">
            <?php
              wp_nav_menu([
                'theme_location' => 'primary',
                'container'      => false,
                'fallback_cb'    => false,
                'menu_class'     => 'footer-menu',
                'depth'          => 1,
              ]);
            ?>
          </div>
        </nav>

        <!-- Column 3: Contact Details -->
        <div class="footer-col footer-contact" aria-label="Contact details">
          <h3 class="footer-title">Contact Details</h3>

          <div class="footer-contact__rows">
            <?php if (!empty($address)) : ?>
              <div class="footer-contact__row">
                <i class="fa-solid fa-location-arrow" aria-hidden="true"></i>
                <div class="footer-contact__body">
                  <span class="footer-contact__label">Address:</span>
                  <div class="footer-contact__value"><?php echo nl2br(esc_html($address)); ?></div>
                </div>
              </div>
            <?php endif; ?>

            <?php if (!empty($phone_tel) && !empty($phone_display)) : ?>
              <div class="footer-contact__row">
                <i class="fa-solid fa-phone" aria-hidden="true"></i>
                <div class="footer-contact__body">
                  <span class="footer-contact__label">Call us:</span>
                  <a class="footer-contact__value" href="<?php echo esc_url('tel:' . $phone_tel); ?>">
                    <?php echo esc_html($phone_display); ?>
                  </a>
                </div>
              </div>
            <?php endif; ?>

            <?php if (!empty($email)) : ?>
              <div class="footer-contact__row">
                <i class="fa-solid fa-envelope" aria-hidden="true"></i>
                <div class="footer-contact__body">
                  <span class="footer-contact__label">Mail us at:</span>
                  <a class="footer-contact__value" href="<?php echo esc_url('mailto:' . $email); ?>">
                    <?php echo esc_html($email); ?>
                  </a>
                </div>
              </div>
            <?php endif; ?>

            <?php if (!empty($hours)) : ?>
              <div class="footer-contact__row">
                <i class="fa-regular fa-clock" aria-hidden="true"></i>
                <div class="footer-contact__body">
                  <span class="footer-contact__label">Hours:</span>
                  <div class="footer-contact__value"><?php echo esc_html($hours); ?></div>
                </div>
              </div>
            <?php endif; ?>
          </div>
        </div>

        <!-- Column 4: Map -->
        <div class="footer-col footer-map" aria-label="Map">
          <?php if (!empty($map_iframe)) : ?>
            <div class="footer-map__frame">
              <?php
                // allow iframe only
                echo wp_kses($map_iframe, [
                  'iframe' => [
                    'src' => true, 'width' => true, 'height' => true, 'style' => true,
                    'allowfullscreen' => true, 'loading' => true, 'referrerpolicy' => true,
                    'frameborder' => true, 'title' => true,
                  ],
                ]);
              ?>
            </div>
          <?php endif; ?>
        </div>

      </div>
    </div>
  </section>

  <!-- ===== Bottom bar (like Induscity site-footer) ===== -->
  <div class="footer-bottom">
    <div class="site-container footer-bottom__inner">
      <div class="footer-copyright">
        &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.
      </div>

      <div class="footer-bottom__social">
        <?php
          // reuse footer-social again
          // $locations = get_nav_menu_locations();
          // if (isset($locations['footer-social']) && $locations['footer-social'] != 0) {
          //   $menu_id = $locations['footer-social'];
          //   $items = wp_get_nav_menu_items($menu_id);
          //   if ($items) {
          //     foreach ($items as $item) {
          //       $aria = !empty($item->attr_title) ? $item->attr_title : wp_strip_all_tags($item->title);
          //       echo '<a href="' . esc_url($item->url) . '" aria-label="' . esc_attr($aria) . '">';
          //       echo $item->title;
          //       echo '</a>';
          //     }
          //   }
          // }
        ?>
      </div>
    </div>
  </div>

  <!-- back-to-top button like Induscity -->
  <a href="#page" class="backtotop" aria-label="Back to top">
    <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
  </a>

  <?php wp_footer(); ?>

  <script>
    // Minimal “back to top” show/hide like Induscity
    (function() {
      var btn = document.querySelector('.backtotop');
      if (!btn) return;

      function onScroll() {
        if (window.scrollY > 400) btn.classList.add('show-scroll');
        else btn.classList.remove('show-scroll');
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();
  </script>
</footer>
</body>
</html>