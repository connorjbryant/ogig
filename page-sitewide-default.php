<?php
/*
Template Name: Sitewide Default
*/
get_header();
?>

<main id="primary" class="site-main">
  <?php
    while (have_posts()) {
      the_post();
      the_content();
    }
  ?>
</main>

<?php get_footer(); ?>
