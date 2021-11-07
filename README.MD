## Introduction

<a href="https://github.com/overextended/oxmysql">Oxmysql</a> is originaly a fiveM simple database manager that utilizes <a href="https://github.com/sidorares/node-mysql2">node-mysql2</a>

This library was converted to alt:V in order to enable an easy development enviroment using mySQL.

## Features

<li>Support for URI connection strings and semicolon separated values</li>
<li>Asynchronous queries utilising mysql2/promises connection pool</li>
<li>Support for placeholder values (named and unnamed) to improve query speed and increase security against SQL injection</li>
<li>Improved error checking when placeholders and parameters do not match</li>

## Setup

This is a plug and play library, so you just need to download the last release from github, put in your alt:V resource folder, and configure the server.cfg to load the resource with your database configuration 

## Configuration

This conversion allows the use of server.cfg to setup database variables such as

```sh
mysql_connection_string: 'mysql://user:password@localhost/database?charset=utf8mb4'
```

```sh
mysql_debug: 'true'
```    

>IMPORTANT NOTE: Remember to put an space between the variable name and variable value

## How to import 

To import oxmysql to your alt:V resource just use

```sh
import oxmysql from 'altv-oxmysql' 
```

## Usage

```sh
ox.execute("SELECT 1", [], (res) => {}, alt.resourceName)
```

## Placeholders

This allows queries to be properly prepared and escaped, as well as improve query times for frequently accessed queries.
The following lines are equivalent.

```sh
"SELECT group FROM users WHERE identifier = ?", ['identifier']  

"SELECT group FROM users WHERE identifier = :identifier", {identifier: 'identifier'}  
```

You can also use the following syntax when you are uncertain about the column to select.

```sh
"SELECT ?? FROM users WHERE identifier = ?", {column, identifier} 
```
instead of using  
```sh
"SELECT "+column+" FROM users WHERE identifier = ?", {identifier}
```