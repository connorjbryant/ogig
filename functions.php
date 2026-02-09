<?php
/**
 * Theme bootstrap
 * - Minified build assets (CSS/JS) with fallbacks
 * - AOS + jQuery
 * - Theme supports + editor styles
 * - Register blocks (single registration with deps)
 */

/* ---------------------------------
 * Helpers
 * --------------------------------- */

// Adds file versioning to help bust cache
function theme_file_ver( $fs_path ) {
  return file_exists( $fs_path ) ? filemtime( $fs_path ) : null;
}

/* ---------------------------------
 * Front-end assets
 * --------------------------------- */
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
      'aos',
      'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css',
      [],
      '2.3.4'
    );
    wp_enqueue_script(
      'aos',
      'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js',
      [],
      '2.3.4',
      true
    );
    wp_enqueue_style(
      'font-awesome',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
      [],
      '6.6.0'
    );
    wp_enqueue_style(
      'figtree-font',
      'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap',
      [],
      null
    );

    // CSS: prefer build/css/style.min.css → fallback to root style.css
    $build_css_fs = get_stylesheet_directory() . '/build/css/style.min.css';
    if ( file_exists( $build_css_fs ) ) {
      wp_enqueue_style(
          'theme-style',
          get_stylesheet_directory_uri() . '/build/css/style.min.css',
          [],
          theme_file_ver( $build_css_fs )
      );
    } else {
      // Root style.css
      $root_css_fs = get_stylesheet_directory() . '/style.css';
      wp_enqueue_style(
          'theme-style',
          get_stylesheet_uri(),
          [],
          theme_file_ver( $root_css_fs ) ?: wp_get_theme()->get('Version')
      );
    }

    // jQuery (WP bundled)
    wp_enqueue_script('jquery');

    // JS: prefer build/js/main.min.js → fallback to /js/main.js
    $build_js_fs = get_stylesheet_directory() . '/build/js/main.min.js';
    if ( file_exists( $build_js_fs ) ) {
      wp_enqueue_script(
        'theme-main',
        get_stylesheet_directory_uri() . '/build/js/main.min.js',
        ['jquery', 'aos'],
        theme_file_ver( $build_js_fs ),
        true
      );
    } else {
      $plain_js_fs = get_stylesheet_directory() . '/js/main.js';
      if ( file_exists( $plain_js_fs ) ) {
        wp_enqueue_script(
            'theme-main',
            get_stylesheet_directory_uri() . '/js/main.js',
            ['jquery', 'aos'],
            theme_file_ver( $plain_js_fs ),
            true
        );
      }
    }
});

/* ---------------------------------
 * Theme supports + menus + editor styles
 * --------------------------------- */
add_action('after_setup_theme', function () {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('custom-logo');

  // Editor styles (prefer build/css/editor.min.css if present)
  add_theme_support('editor-styles');
  $editor_build_fs = get_stylesheet_directory() . '/build/css/editor.min.css';
  if ( file_exists( $editor_build_fs ) ) {
      add_editor_style( 'build/css/editor.min.css' );
  }

  register_nav_menus([
      'primary' => __('Primary Menu', 'theme'),
      'header-social'  => __('Header Social Links', 'theme'),
      'footer-social' => __('Footer Social Links', 'theme'),
  ]);
});

/* ---------------------------------
 * Block: ogig/hero
 * - Register editor script handle (deps ensure wp.* exists)
 * - Register block from block.json ONCE (idempotent)
 * --------------------------------- */
add_action('init', function () {
  $block_dir_fs  = trailingslashit( get_stylesheet_directory() ) . 'blocks/hero';
  $block_json_fs = $block_dir_fs . '/block.json';
  if ( ! file_exists( $block_json_fs ) ) {
    if ( defined('WP_DEBUG') && WP_DEBUG ) {
      error_log('[blocks] block.json not found at ' . $block_json_fs);
    }
    return;
  }

  // Register the editor script handle referenced by block.json ("editorScript": "theme-hero-editor")
  $editor_fs = $block_dir_fs . '/editor.js';
  if ( file_exists( $editor_fs ) ) {
    wp_register_script(
      'theme-hero-editor',
      trailingslashit( get_stylesheet_directory_uri() ) . 'blocks/hero/editor.js',
      [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-editor' ],
      theme_file_ver( $editor_fs ),
      true
    );
  }

  // Avoid duplicate registration if parent theme/plugin already did it
  $registry = WP_Block_Type_Registry::get_instance();
  if ( $registry->is_registered( 'ogig/hero' ) ) {
    return;
  }

  register_block_type_from_metadata( $block_dir_fs );
});

// === Gooey Search: register scripts + block ===
add_action('init', function () {
  // Frontend bundle (bundles framer-motion; React/DOM stay external)
  $front_fs = get_stylesheet_directory() . '/build/js/gooey-frontend.js';
  if ( file_exists($front_fs) ) {
    wp_register_script(
      'ogig-gooey-frontend',
      get_stylesheet_directory_uri() . '/build/js/gooey-frontend.js',
      [], // ← no deps; bundle includes React/DOM/FM
      filemtime($front_fs),
      true
    );

    // Add an accessible label to the dynamic gooey search input
    $inline = <<<JS
    document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-gooey-search-input').forEach(function (input) {
      if (!input.id) return;

      // Don’t duplicate labels
      var existing = document.querySelector('label[for="' + input.id + '"]');
      if (existing) return;

      var label = document.createElement('label');
      label.setAttribute('for', input.id);
      label.textContent = 'Search site';

      // Visually hidden but available to screen readers
      label.style.position = 'absolute';
      label.style.left = '-9999px';

      // Insert before the input
      if (input.parentNode) {
        input.parentNode.insertBefore(label, input);
      }
    });
  });
  JS;
    wp_add_inline_script('ogig-gooey-frontend', $inline);
  }

  // Editor bundle
  $edit_fs = get_stylesheet_directory() . '/build/js/gooey-editor.js';
  if ( file_exists($edit_fs) ) {
    wp_register_script(
      'ogig-gooey-editor',
      get_stylesheet_directory_uri() . '/build/js/gooey-editor.js',
      [ 'wp-blocks', 'wp-element', 'wp-i18n', 'wp-block-editor' ],
      filemtime($edit_fs),
      true
    );
  }

  // Register block
  $block_dir = get_stylesheet_directory() . '/blocks/gooey-search';
  if ( file_exists($block_dir . '/block.json') ) {
    register_block_type_from_metadata( $block_dir );
  }
});

/* Connect to endpoint to search posts, pages, products */
add_action('rest_api_init', function () {
  register_rest_route('ogig/v1', '/search', [
    'methods'  => 'GET',
    'callback' => function (WP_REST_Request $req) {
      $q = trim(sanitize_text_field((string) $req->get_param('s')));

      // Optional: don’t search on 1-char terms (saves a LOT of load)
      if ($q === '' || mb_strlen($q) < 2) {
        return rest_ensure_response([]);
      }

      $cache_key = 'ogig_search_' . md5(mb_strtolower($q));
      $cached = get_transient($cache_key);
      if ($cached !== false) {
        return rest_ensure_response($cached);
      }

      $results   = [];
      $added_ids = [];

      // 1) Main content search (posts/pages/products)
      $main_ids = new WP_Query([
        's'                      => $q,
        'post_type'              => ['post', 'page', 'product'],
        'post_status'            => 'publish',
        'posts_per_page'         => 5,
        'fields'                 => 'ids',
        'no_found_rows'          => true,
        'ignore_sticky_posts'    => true,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
      ]);

      if (!empty($main_ids->posts)) {
        foreach ($main_ids->posts as $id) {
          $added_ids[$id] = true;

          $type = get_post_type($id);
          $results[] = [
            'id'         => $id,
            'title'      => get_the_title($id),
            'url'        => get_permalink($id),
            'type'       => $type,
            'sku'        => ($type === 'product') ? (string) get_post_meta($id, '_sku', true) : '',
            'match_type' => 'content',
          ];
        }
      }

      // 2) SKU search (fast path)
      global $wpdb;
      $like = '%' . $wpdb->esc_like($q) . '%';

      // Prefer WooCommerce lookup table if present
      $lookup_table = $wpdb->prefix . 'wc_product_meta_lookup';
      $has_lookup = ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $lookup_table)) === $lookup_table);

      if ($has_lookup) {
        $sku_ids = $wpdb->get_col($wpdb->prepare(
          "SELECT product_id
           FROM {$lookup_table}
           WHERE sku LIKE %s
           LIMIT 5",
          $like
        ));
      } else {
        // Fallback: wp_postmeta scan (still faster than WP_Query meta_query overhead)
        $sku_ids = $wpdb->get_col($wpdb->prepare(
          "SELECT pm.post_id
           FROM {$wpdb->postmeta} pm
           INNER JOIN {$wpdb->posts} p ON p.ID = pm.post_id
           WHERE pm.meta_key = '_sku'
             AND pm.meta_value LIKE %s
             AND p.post_type = 'product'
             AND p.post_status = 'publish'
           LIMIT 5",
          $like
        ));
      }

      if (!empty($sku_ids)) {
        foreach ($sku_ids as $id) {
          $id = (int) $id;
          if ($id <= 0 || isset($added_ids[$id])) continue;
          $added_ids[$id] = true;

          $results[] = [
            'id'         => $id,
            'title'      => get_the_title($id),
            'url'        => get_permalink($id),
            'type'       => 'product',
            'sku'        => (string) get_post_meta($id, '_sku', true),
            'match_type' => 'sku',
          ];
        }
      }

      // Cache for a few minutes
      set_transient($cache_key, $results, 5 * MINUTE_IN_SECONDS);

      return rest_ensure_response($results);
    },
    'permission_callback' => '__return_true',
  ]);
});

/**
 * Include WooCommerce products in the main search results
 */
add_action('pre_get_posts', function ($query) {
  if (is_admin()) {
    return;
  }

  // Front-end main search query
  if ($query->is_main_query() && $query->is_search()) {
    $query->set('post_type', ['post', 'page', 'product']);
  }
});

/* Hide admin bar when logged in */
function hide_admin_bar(){
  return false;
}
add_filter( 'show_admin_bar' , 'hide_admin_bar');

/* Preconnect fonts for fast loading */
add_filter('wp_resource_hints', function ($urls, $relation_type) {
  if ('preconnect' === $relation_type) {
    $urls[] = [
      'href' => 'https://fonts.gstatic.com',
      'crossorigin' => true,
    ];
    $urls[] = 'https://fonts.googleapis.com';
  }
  return $urls;
}, 10, 2);

/* -------------
 * WooCommerce
 * ---------- */
// Insert product title above price
add_action( 'woocommerce_single_product_summary', 'ogig_title_above_price', 4 );
function ogig_title_above_price() {
  echo '<h1 class="ogig-product-title">' . get_the_title() . '</h1>';
}

/**
 * Forklift next to Add to Cart button (inline SVG, only forks move)
 */
add_action( 'woocommerce_before_add_to_cart_button', 'ogig_forklift_btn_wrap_open', 1 );
function ogig_forklift_btn_wrap_open() {
  if ( ! is_product() ) {
    return;
  }

  echo '<span class="fr-forklift-btn-wrap">';
}

add_action( 'woocommerce_after_add_to_cart_button', 'ogig_forklift_btn_wrap_close_and_svg', 50 );
function ogig_forklift_btn_wrap_close_and_svg() {
    if ( ! is_product() ) return;

    echo '<span class="fr-forklift-svg">' . file_get_contents( get_stylesheet_directory() . '/build/img/forklift.svg' ) . '</span>';
    echo '</span>'; // close .fr-forklift-btn-wrap
}

/* WooCommerce upsells */
// 1. Make sure WooCommerce doesn't inject its normal upsell block
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_upsell_display', 15 );
remove_action( 'woocommerce_after_add_to_cart_button', 'woocommerce_upsell_display', 10 );

// 2. Add custom upsell block after SKU / Category
add_action( 'woocommerce_product_meta_end', 'ogig_render_recommended_parts_block', 20 );

function ogig_render_recommended_parts_block() {
    global $product;

    if ( ! $product instanceof WC_Product ) {
        return;
    }

    // Get upsell IDs assigned to this product in the admin
    $upsell_ids = $product->get_upsell_ids();

    if ( empty( $upsell_ids ) ) {
        return; // nothing to show
    }

    // Query those products
    $args = [
        'post_type'      => 'product',
        'post__in'       => $upsell_ids,
        'orderby'        => 'post__in', // keep same order you chose in admin
        'posts_per_page' => -1,
    ];

    $upsell_query = new WP_Query( $args );

    if ( ! $upsell_query->have_posts() ) {
        return;
    }

    ?>
    <div class="ogig-recommended-parts">
        <div class="ogig-recommended-heading">You may also like…</div>

        <?php while ( $upsell_query->have_posts() ) : $upsell_query->the_post();
            $upsell_product = wc_get_product( get_the_ID() );
            if ( ! $upsell_product ) continue;

            $price_html   = $upsell_product->get_price_html();
            $title        = $upsell_product->get_name();
            $permalink    = get_permalink( $upsell_product->get_id() );
            $thumbnail    = $upsell_product->get_image( 'woocommerce_thumbnail' ); // <img ...>
            $add_to_cart_url  = $upsell_product->add_to_cart_url();
            $add_to_cart_text = $upsell_product->add_to_cart_text();
            $add_to_cart_class= implode( ' ', array_filter( [
                'button',
                'ogig-rec-addtocart',
                'product_type_' . $upsell_product->get_type(),
                $upsell_product->supports( 'ajax_add_to_cart' ) ? 'ajax_add_to_cart' : ''
            ] ) );
            ?>

            <div class="ogig-rec-item">
                <a class="ogig-rec-thumb" href="<?php echo esc_url( $permalink ); ?>">
                    <?php echo $thumbnail; ?>
                </a>

                <div class="ogig-rec-info">
                    <a class="ogig-rec-title" href="<?php echo esc_url( $permalink ); ?>">
                        <?php echo esc_html( $title ); ?>
                    </a>

                    <div class="ogig-rec-price">
                        <?php echo wp_kses_post( $price_html ); ?>
                    </div>
                </div>

                <div class="ogig-rec-cta">
                    <a
                        href="<?php echo esc_url( $add_to_cart_url ); ?>"
                        data-quantity="1"
                        class="<?php echo esc_attr( $add_to_cart_class ); ?> ogig-rec-addtocart"
                        data-product_id="<?php echo esc_attr( $upsell_product->get_id() ); ?>"
                        data-product_sku="<?php echo esc_attr( $upsell_product->get_sku() ); ?>"
                        aria-label="<?php echo esc_attr( $add_to_cart_text ); ?>"
                        rel="nofollow"
                    >
                        <?php echo esc_html( $add_to_cart_text ); ?>
                    </a>
                </div>
            </div>


        <?php endwhile; ?>
        <?php wp_reset_postdata(); ?>
    </div>
    <?php
}

/* Move Related products to bottom of product page */
// Remove the default Woo location under the summary
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );

// Re-add it after the entire product content
add_action( 'woocommerce_after_single_product', 'ogig_related_products_bottom', 20 );
function ogig_related_products_bottom() {
  // Only on single product pages
  if ( ! is_product() ) {
    return;
  }

  echo '<div class="ogig-related-bottom">';
  woocommerce_output_related_products();
  echo '</div>';
}

// Apply custom CSS class to social links
add_filter('nav_menu_link_attributes', function ($atts, $item, $args, $depth) {
    // Only apply to footer-social menu
    if ($args->theme_location === 'footer-social') {
        $atts['class'] = 'utility-social__link';
    }
    return $atts;
}, 10, 4);

add_action('acf/init', function () {
  if (!function_exists('acf_register_block_type')) return;

  acf_register_block_type([
    'name'            => 'ogig-product-cards-hero',
    'title'           => 'OGIG – Product Cards Hero',
    'description'     => 'Hero background with heading and 3 product cards.',
    'render_template' => get_template_directory() . '/template-parts/blocks/product-cards-hero.php',
    'category'        => 'formatting',
    'icon'            => 'images-alt2',
    'keywords'        => ['hero', 'cards', 'products'],
    'mode'            => 'preview',
    'supports'        => [
      'align' => ['wide', 'full'],
      'jsx'   => true,
    ],
  ]);
});

add_shortcode('ogig_product_cards_hero', function () {
  ob_start();
  get_template_part('template-parts/blocks/product-cards-hero');
  return ob_get_clean();
});