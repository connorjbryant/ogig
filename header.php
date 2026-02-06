<?php
/**
 * header.php (OGIG Indus v4)
 */

// Site Settings (page slug: site-settings)
$settings_page = get_page_by_path('site-settings');
$settings_id   = $settings_page ? (int) $settings_page->ID : 0;

// ACF helpers
$acf = function(string $key, string $default = '') use ($settings_id) {
  if (!$settings_id) return $default;
  $val = get_field($key, $settings_id);
  return is_string($val) ? $val : (string) $val;
};

$phone_display = $acf('phone_display');
$phone_tel     = $acf('phone_tel');
$email         = $acf('email');
$address       = $acf('address');
$hours         = $acf('hours');

$fax_display   = $acf('fax_display');
$fax_tel       = $acf('fax_tel');

$address_one_line = preg_replace('/\s+/', ' ', trim($address));
$maps_url = $address_one_line
  ? ('https://www.google.com/maps/search/?api=1&query=' . rawurlencode($address_one_line))
  : '';

$topbar_tagline = 'Precision Craftsmanship Since 1969, Engineered for Excellence.';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
  <script>
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('has-js');
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <link rel="profile" href="http://gmpg.org/xfn/11">
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div class="site-overlay" aria-hidden="true"></div>

<header class="site-header site-header--indus-v4" role="banner">

  <!-- TOPBAR -->
  <div class="header-topbar" role="region" aria-label="Header top bar">
    <div class="site-container">
      <div class="topbar-inner">

        <div class="topbar-left">
          <span class="topbar-check" aria-hidden="true">
            <i class="fa-solid fa-check"></i>
          </span>
          <span class="topbar-tagline"><?php echo esc_html($topbar_tagline); ?></span>
        </div>

        <div class="topbar-right">
          <div class="header-search">
            <?php
              echo do_blocks(
                '<!-- wp:ogig/gooey-search {"placeholder":"Search…","context":"header","action":"' . esc_url(home_url('/')) . '"} /-->'
              );
            ?>
          </div>

          <a class="topbar-item topbar-phone topbar-dynamic"
             href="<?php echo esc_url('tel:' . $phone_tel); ?>"
             data-default-icon="phone"
             data-default-label="Call:"
             data-default-value="<?php echo esc_attr($phone_display); ?>"
             data-default-href="<?php echo esc_attr('tel:' . $phone_tel); ?>">
            <i class="fa-solid fa-phone" aria-hidden="true"></i>
            <span class="topbar-dynamic__label">Call:</span>
            <span class="topbar-dynamic__value"><?php echo esc_html($phone_display); ?></span>
          </a>

          <div class="topbar-item topbar-contact">
            <button class="topbar-contact__btn" type="button" aria-haspopup="true" aria-expanded="false">
              Contact <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
            </button>

            <div class="topbar-contact__menu" hidden>

              <a class="topbar-contact__link js-topbar-pick" href="#"
                 data-icon="phone"
                 data-label="Call:"
                 data-value="<?php echo esc_attr($phone_display); ?>"
                 data-href="<?php echo esc_attr('tel:' . $phone_tel); ?>">
                Contact
              </a>

              <a class="topbar-contact__link js-topbar-pick" href="#"
                 data-icon="fax"
                 data-label="Fax:"
                 data-value="<?php echo esc_attr($fax_display); ?>"
                 data-href="<?php echo esc_attr('tel:' . $fax_tel); ?>">
                Fax
              </a>

              <a class="topbar-contact__link js-topbar-pick" href="#"
                 data-icon="clock"
                 data-label="Hours:"
                 data-value="<?php echo esc_attr($hours); ?>"
                 data-href="">
                Hours
              </a>

              <a class="topbar-contact__link js-topbar-pick" href="#"
                 data-icon="location"
                 data-label="Address:"
                 data-value="<?php echo esc_attr($address_one_line); ?>"
                 data-href="<?php echo esc_attr($maps_url); ?>">
                Address
              </a>

            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- MAIN HEADER -->
  <div class="header-main">
    <div class="site-container">

      <noscript>
        <div class="no-js-banner" role="alert" aria-live="polite">
          <p><strong>Heads up:</strong> Please enable JavaScript to use the mobile menu.</p>
        </div>
      </noscript>

      <div class="header-inner header-inner--v4">

        <div class="header__left">
          <div class="site-branding">
            <?php if (has_custom_logo()) { the_custom_logo(); } else { ?>
              <h1 class="site-title">
                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">OGIG Factory Direct</a>
              </h1>
            <?php } ?>
          </div>
        </div>

        <a class="header-btn header-btn--dealer" href="<?php echo esc_url(home_url('/dealer-login/')); ?>">
          Dealer Login
        </a>

        <nav class="main-navigation mobile-menu" role="navigation" aria-label="<?php echo esc_attr__('Primary Menu', 'textdomain'); ?>">

          <div class="header-search header-search--mobile">
            <?php
              echo do_blocks(
                '<!-- wp:ogig/gooey-search {"placeholder":"Search…","context":"header","action":"' . esc_url(home_url('/')) . '"} /-->'
              );
            ?>
          </div>

          <ul class="nav-menu">
            <?php
              wp_nav_menu([
                'theme_location' => 'primary',
                'container'      => false,
                'fallback_cb'    => false,
                'items_wrap'     => '%3$s',
                'depth'          => 3,
              ]);
            ?>
          </ul>
        </nav>

        <div class="header-actions">
          <a class="header-btn header-btn--cta" href="<?php echo esc_url(home_url('/request-a-quote/')); ?>">
            Request a Quote
          </a>

          <div class="header__cart">
            <a href="<?php echo esc_url(wc_get_cart_url()); ?>" title="View your shopping cart">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.55 1.5-1.31l3.78-7.3c.12-.23.18-.5.18-.79 0-.82-.67-1.5-1.5-1.5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
              </svg>
              <span class="header__cart-count"><?php echo (int) WC()->cart->get_cart_contents_count(); ?></span>
            </a>
          </div>

          <button class="mobile-hamburger" aria-label="Toggle Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>

      </div>
    </div>
  </div>

</header>