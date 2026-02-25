<?php get_header(); ?>

<main class="site-container site-main error-404" role="main">
  <section class="error-404__inner">

    <div class="error-404__content">
      <h1 class="error-404__title">Page Not Found</h1>
      <p class="error-404__message">
        The page you’re looking for may have been moved or doesn’t exist.
      </p>

      <div class="error-404__actions">
        <a class="error-404__link" href="<?php echo esc_url(home_url('/our-products/')); ?>">Browse Products</a>
      </div>
    </div>

    <div class="error-404__stage">
      <div id="ogig-404-3d" aria-hidden="true">
        <canvas class="webgl"></canvas>
      </div>

      <!-- Option B: subtle hint (not on the sign) -->
      <p class="error-404__hint" aria-hidden="true">Tip: drag/swipe the sign to swing it.</p>
      <br />
    </div>

  </section>
</main>

<?php get_footer(); ?>