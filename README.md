# Mozilla MarkUp to JSON

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/0x7rg9TpHSo/0.jpg)](https://www.youtube.com/watch?v=0x7rg9TpHSo)


A long long time ago (2011 to be exact) Evan Roth and Mozilla did a project in celebration of the open web.
Everyone could sign the website with their own tag.
All of the tags would then be connected to form a very long continuos line.

The project resulted in a collection of roughly 1.5 million of tags.
Not sure if there is some overlap with the tags hosted over at the [GML Blackbook](http://000000book.com/)...

Unfortunately the project is not live anymore.
But  you can still get the [code on github](https://github.com/mozilla/markup) and the [data on mozilla](https://ftp.mozilla.org/pub/data/markup.mozilla.org/markup_mark_anonymized.sql.bz2) (20 GB). The website was powered by Django using MySQL, so all the data is one huge SQL dump.

This repo shows how to get the data into your local MySQL database + comes with a script to extract the tags as JSON.

## Things to do ...

* (Re)-animate them in P5.js
* Set up a CouchDB and grant access to everybody
* Concatenate, Cut-Up, Overlay, Sort, Arrange, Remix!
* Feed your Neural Nets and create an Artificial Graffiti Artist!


# License

![WTFPL](wtfpl.png)


Get the Data
============

Here's how to do it (OSX):

Download the file

    curl -O https://ftp.mozilla.org/pub/data/markup.mozilla.org/markup_mark_anonymized.sql.bz2

Deflate the SQL dump

    bunzip2 markup_mark_anonymized.sql.bz2

Install MySQL

    brew install mysql

Start the MySQL server

    mysql.server

Create the database

    mysql -u root -e "create database markup;"

Import the database dump (this will take some time)

    mysql -u root -p markup  < data/markup_mark_anonymized.sql

You can now use MySQL to explore the data:

    mysql -u root

SQL command to display the first couple of entries:

```sql
PAGER less -S;
SELECT * FROM markup.markup_mark LIMIT 500;
```

SQL command to count the entries. (1.449.231 entries):

```sql
SELECT COUNT (*) FROM markup.markup_mark;
```

Exit MySQL ...

    quit

Let's export mark number 100 to json (using node.js)

    npm install
    node mark2json.js 100

If you have some Gigabytes left on your harddrive go ahead and extract them all...

    npm run all


## Links
#### Frontend (Javascript)
* [Marks Class](https://github.com/mozilla/markup/tree/master/ffdemo/static/assets/js/vendor/mark)
* [JQuery Marks](
https://github.com/mozilla/markup/blob/master/ffdemo/static/assets/js/vendor/jquery.markApp.intro.js
)

#### Backend (Django)
* [Django Model](https://github.com/mozilla/markup/blob/master/ffdemo/markup/models.py)
* [South Migration](https://github.com/mozilla/markup/blob/master/ffdemo/markup/migrations/0021_fix_mark_reference_collation.py
)

## SQL Dump

The actual motion data is stored in the `markup_mark` table in the field `points_obj_simplified`.
Each mark has a unique id stored in the ID field.

```sql
--
-- Table structure for table `markup_mark`
--

DROP TABLE IF EXISTS `markup_mark`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `markup_mark` (
  `id` int(11) NOT NULL auto_increment,
  `date_drawn` datetime NOT NULL,
  `reference` varchar(8) character set latin1 collate latin1_general_cs NOT NULL,
  `points_obj_simplified` longtext NOT NULL,
  `country_code` varchar(2) NOT NULL,
  `flaggings` int(11) NOT NULL,
  `is_approved` tinyint(1) NOT NULL,
  `contributor_locale` varchar(5) default NULL,
  `contributor` varchar(75) default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `markup_mark_reference_uniq` (`reference`),
  KEY `markup_mark_flaggings` (`flaggings`),
  KEY `markup_mark_date_drawn` (`date_drawn`),
  KEY `contributor_locale_index` (`contributor_locale`),
  KEY `contributor_index` (`contributor`),
  KEY `markup_mark_country_code` (`country_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1449639 DEFAULT CHARSET=latin1;
SET character_set_client = @saved_cs_client;
```

## Mark Format

* Each tag is subdivided into strokes
* Each stroke is subdivided into points
* Captured data — (x,y,z) + time
* Derived data — speed, angle, significance

### Example

```json
{
  "id": 3,
  "date_drawn": "2011-05-11T10:25:27.000Z",
  "reference": "yNvD",
  "points_obj_simplified": {
	"strokes": [
	  [
	    { "x": 0, "y": 54, "z": 0, "time": 27, "speed": 0, "angle": 0, "significance": 5 },
	    { "x": 0, "y": 55, "z": 0, "time": 61, "speed": 0.01, "angle": 0, "significance": 1 }
	  ]
	],
  "extra_info": "Mark Up is about all of us and what we can accomplish together, on an open platform. "
}
```
