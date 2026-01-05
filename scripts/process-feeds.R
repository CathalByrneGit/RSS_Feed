# process-feeds.R - RSS Feed Processing
# Processes and cleans RSS feed data

library(dplyr)
library(lubridate)
library(stringr)

#' Process raw RSS articles
#' @param articles data.frame from fetch_all_feeds()
#' @return cleaned and processed data.frame
process_articles <- function(articles) {

  message(sprintf("DEBUG: process_articles() called with %d rows", nrow(articles)))

  if (nrow(articles) == 0) {
    message("DEBUG: No articles to process, returning empty data frame")
    return(articles)
  }

  message(sprintf("DEBUG: Processing %d articles...", nrow(articles)))
  message(sprintf("DEBUG: Article columns: %s", paste(names(articles), collapse = ", ")))

  processed <- articles %>%
    # Parse dates
    mutate(
      pub_date = as_datetime(item_pub_date, tz = "UTC"),
      date_formatted = format(pub_date, "%B %d, %Y")
    ) %>%
    # Add time ago (after pub_date is created)
    mutate(
      time_ago = format_time_ago(pub_date)
    ) %>%
    # Clean descriptions and create excerpts
    mutate(
      description_clean = str_replace_all(item_description, "<[^>]+>", ""),
      excerpt = str_trunc(description_clean, 200, "right"),
      title_clean = str_replace_all(item_title, "<[^>]+>", "")
    ) %>%
    # Sort by date (newest first)
    arrange(desc(pub_date)) %>%
    # Select relevant columns
    select(
      source,
      title = title_clean,
      link = item_link,
      excerpt,
      pub_date,
      date_formatted,
      time_ago,
      author = item_author,
      category = item_category1
    )

  message(sprintf("  ✓ Processed %d articles", nrow(processed)))

  return(processed)
}

#' Format time ago string (vectorized)
#' @param datetime POSIXct datetime vector
#' @return character vector like "2 hours ago"
format_time_ago <- function(datetime) {
  # Vectorized version using sapply
  sapply(datetime, function(dt) {
    if (is.na(dt)) return("unknown")

    now <- Sys.time()
    diff <- as.numeric(difftime(now, dt, units = "secs"))

    if (diff < 60) {
      "just now"
    } else if (diff < 3600) {
      mins <- floor(diff / 60)
      sprintf("%d minute%s ago", mins, ifelse(mins > 1, "s", ""))
    } else if (diff < 86400) {
      hours <- floor(diff / 3600)
      sprintf("%d hour%s ago", hours, ifelse(hours > 1, "s", ""))
    } else if (diff < 604800) {
      days <- floor(diff / 86400)
      sprintf("%d day%s ago", days, ifelse(days > 1, "s", ""))
    } else {
      format(dt, "%b %d")
    }
  }, USE.NAMES = FALSE)
}
