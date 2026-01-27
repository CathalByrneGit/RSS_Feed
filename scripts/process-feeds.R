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
      pub_date = case_when(!is.na(item_pub_date) ~ item_pub_date,
                           !is.na(entry_published) ~ entry_published,
                           .default = NA_Date_)|>
        as_datetime(tz = "UTC"),
      date_formatted = format(pub_date, "%B %d, %Y")
    ) %>%
    # Add time ago (after pub_date is created)
    mutate(
      time_ago = format_time_ago(pub_date)
    ) %>%
    # Clean descriptions and create excerpts
    mutate(
      feed_link = if_else(is.na(feed_link),
                          source_url|>gsub('.rss','',x =_),
                          feed_link),
      feed_description = if_else(is.na(feed_description),
                                 NA_character_,
                                 feed_description),
      source = sprintf("%s(%s)",source,if_else(is.na(feed_title),
                                                     '',
                                                     feed_title)),
      description_clean = case_when(!is.na(item_description) ~ item_description,
                                    !is.na(entry_content) ~ entry_content,
                                    .default = 'Description not found')%>%
        str_replace_all( "<[^>]+>", ""),
      excerpt = str_trunc(description_clean, 200, "right"),
      title_clean = case_when(!is.na(item_title) ~ item_title,
                              !is.na(entry_title) ~ entry_title,
                              .default = 'Unkown Title')%>%
        str_replace_all("<[^>]+>", ""),
      item_link = case_when(!is.na(item_link) ~ item_link,
                              !is.na(entry_link) ~ entry_link,
                              .default = 'Unkown Link'),
      category = case_when(!is.null(item_category) ~ item_category,
                           !is.na(entry_category) ~ list(entry_category),
                           .default = NA )
    ) %>%
    # Sort by date (newest first)
    arrange(desc(pub_date)) %>%
    # Select relevant columns
    select(
      source,
      title = title_clean,
      link = item_link,
      feed_link,
      feed_description,
      feed_icon,
      excerpt,
      pub_date,
      date_formatted,
      time_ago,
      author = entry_author,
      category
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
