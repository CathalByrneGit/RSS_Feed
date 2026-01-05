# fetch-feeds.R - RSS Feed Fetching
# Fetches RSS feeds from configured sources

library(tidyRSS)
library(dplyr)
library(yaml)

#' Fetch all configured RSS feeds
#' @return data.frame with all articles from all feeds
fetch_all_feeds <- function() {
  # Read feed configuration
  config <- read_yaml("feeds.yml")

  all_articles <- list()

  message("Fetching RSS feeds...")

  for (feed in config$feeds) {
    message(sprintf("  → Fetching: %s", feed$name))

    tryCatch({
      # Fetch the feed using tidyRSS
      articles <- tidyfeed(feed$url)

      # Add source information
      articles$source <- feed$name
      articles$source_url <- feed$url

      # Store in list
      all_articles[[feed$name]] <- articles

      message(sprintf("    ✓ Got %d articles", nrow(articles)))

    }, error = function(e) {
      message(sprintf("    ✗ Failed: %s", e$message))
    })
  }

  # Combine all feeds into one data frame
  if (length(all_articles) > 0) {
    combined <- bind_rows(all_articles)
    message(sprintf("\nTotal articles fetched: %d", nrow(combined)))
    return(combined)
  } else {
    warning("No feeds were successfully fetched")
    return(data.frame())
  }
}
