<?php
get_header();

$search_term = get_search_query();
$paged       = max(1, (int) get_query_var('paged'));

?>

<main class="site-container site-main" role="main">

  <?php if (function_exists('woocommerce_breadcrumb')) : ?>
    <div class="woocommerce ogig-search-breadcrumbs">
      <?php woocommerce_breadcrumb(); ?>
    </div>
  <?php endif; ?>

  <header class="ogig-search-header">
    <h1 class="ogig-search-title">
      Search Results for “<?php echo esc_html($search_term); ?>”
    </h1>
  </header>

  <?php
  /**
   * 1) PRODUCTS GRID (WooCommerce style)
   */
  if (class_exists('WooCommerce')) :

    $product_query = new WP_Query([
      'post_type'      => 'product',
      'post_status'    => 'publish',
      's'              => $search_term,
      'posts_per_page' => 12,
      'paged'          => $paged,
    ]);

    if ($product_query->have_posts()) : ?>
      <section class="ogig-search-section ogig-search-section--products">
        <div class="woocommerce">
          <?php
          woocommerce_product_loop_start();

          while ($product_query->have_posts()) :
            $product_query->the_post();
            wc_get_template_part('content', 'product'); // image, title, price, add-to-cart, etc.
          endwhile;

          woocommerce_product_loop_end();
          ?>
        </div>

        <?php
        // Pagination for products
        $total_pages = (int) $product_query->max_num_pages;
        if ($total_pages > 1) :
          echo '<nav class="ogig-search-pagination">';
          echo paginate_links([
            'total'   => $total_pages,
            'current' => $paged,
          ]);
          echo '</nav>';
        endif;
        ?>
      </section>
    <?php endif;

    wp_reset_postdata();

  endif;
  ?>

  <?php
  /**
   * 2) NON-PRODUCT RESULTS (pages/posts/etc.)
   * We run a separate query so you still get pages like your current ogig output,
   * but products are handled above in a proper grid.
   */
  $other_query = new WP_Query([
    'post_type'      => ['page', 'post'],
    'post_status'    => 'publish',
    's'              => $search_term,
    'posts_per_page' => 20,
    'paged'          => 1,
  ]);

  if ($other_query->have_posts()) : ?>
    <section class="ogig-search-section ogig-search-section--other">
      <h2 class="ogig-search-subtitle">Other results</h2>

      <ul class="ogig-search-list">
        <?php while ($other_query->have_posts()) : $other_query->the_post(); ?>
          <li class="ogig-search-list__item">
            <a class="ogig-search-list__link" href="<?php the_permalink(); ?>">
              <?php the_title(); ?>
            </a>
          </li>
        <?php endwhile; ?>
      </ul>
    </section>
  <?php endif;

  wp_reset_postdata();

  // If nothing at all matched:
  if (
    (!isset($product_query) || !$product_query->have_posts())
    && !$other_query->have_posts()
  ) : ?>
    <p>No results found.</p>
  <?php endif; ?>

</main>

<?php get_footer(); ?>