<a name="datatypes"></a>
# Class DataTypes
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L309)
A convenience class holding commonly used data types. The datatypes are used when definining a new model using `Sequelize.define`, like this:
```js
sequelize.define('model', {
  column: DataTypes.INTEGER
})
```
When defining a model you can just as easily pass a string as type, but often using the types defined here is beneficial. For example, using `DataTypes.BLOB`, mean
that that column will be returned as an instance of `Buffer` when being fetched by sequelize.

Some data types have special properties that can be accessed in order to change the data type. For example, to get an unsigned integer with zerofill you can do `DataTypes.INTEGER.UNSIGNED.ZEROFILL`.
The order you access the properties in do not matter, so `DataTypes.INTEGER.ZEROFILL.UNSIGNED` is fine as well. The available properties are listed under each data type.

To provide a length for the data type, you can invoke it like a function: `INTEGER(2)`

Three of the values provided here (`NOW`, `UUIDV1` and `UUIDV4`) are special default values, that should not be used to define types. Instead they are used as shorthands for
defining default values. For example, to get a uuid field with a default value generated following v1 of the UUID standard:
```js
sequelize.define('model', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true
  }
})
```


***

<a name="string"></a>
## `STRING`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L317)
A variable length string. Default length 255

Available properties: `BINARY`


***

<a name="char"></a>
## `CHAR`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L325)
A fixed length string. Default length 255

Available properties: `BINARY`


***

<a name="text"></a>
## `TEXT`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L330)
An unlimited length text column

***

<a name="integer"></a>
## `INTEGER`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L338)
A 32 bit integer.

Available properties: `UNSIGNED`, `ZEROFILL`


***

<a name="bigint"></a>
## `BIGINT`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L346)
A 64 bit integer.

Available properties: `UNSIGNED`, `ZEROFILL`


***

<a name="date"></a>
## `DATE`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L351)
A datetime column

***

<a name="dateonly"></a>
## `DATEONLY`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L356)
A date only column

***

<a name="boolean"></a>
## `BOOLEAN`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L361)
A boolean / tinyint column, depending on dialect

***

<a name="float"></a>
## `FLOAT`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L369)
Floating point number. Accepts one or two arguments for precision

Available properties: `UNSIGNED`, `ZEROFILL`


***

<a name="now"></a>
## `NOW`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L374)
A default value of the current timestamp

***

<a name="blob"></a>
## `BLOB`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L380)
Binary storage. Available lengths: `tiny`, `medium`, `long`


***

<a name="decimal"></a>
## `DECIMAL`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L388)
Decimal number. Accepts one or two arguments for precision

Available properties: `UNSIGNED`, `ZEROFILL`


***

<a name="uuid"></a>
## `UUID`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L393)
A column storing a unique univeral identifier. Use with `UUIDV1` or `UUIDV4` for default values.

***

<a name="uuidv1"></a>
## `UUIDV1`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L398)
A default unique universal identifier generated following the UUID v1 standard

***

<a name="uuidv4"></a>
## `UUIDV4`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L403)
A default unique universal identifier generated following the UUID v2 standard

***

<a name="hstore"></a>
## `HSTORE`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L409)
A key / value column. Only available in postgres.

***

<a name="virtual"></a>
## `VIRTUAL`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L449)
A virtual value that is not stored in the DB. This could for example be useful if you want to provide a default value in your model
that is returned to the user but not stored in the DB.

You could also use it to validate a value before permuting and storing it. Checking password length before hashing it for example:
```js
sequelize.define('user', {
  password_hash: DataTypes.STRING
  password: {
    type: DataTypes.VIRTUAL,
    set: function (val) {
       this.setDataValue('password', val);
       this.setDataValue('password_hash', this.salt + val);
     },
     validate: {
        isLongEnough: function (val) {
          if (val.length < 7) {
            throw new Error("Please choose a longer password")
         }
      }
    }
  }
})
```
In the above code the password is stored plainly in the password field so it can be validated, but is never stored in the DB.
__Aliases:__ NONE

***

<a name="enum"></a>
## `ENUM`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L457)
An enumeration. `DataTypes.ENUM('value', 'another value')`.


***

<a name="array"></a>
## `ARRAY()`
[View code](https://github.com/sequelize/sequelize/blob/5aa77fa291abeaf0498f65724000c75da9ab9028/lib/data-types.js#L477)
An array of `type`, e.g. `DataTypes.ARRAY(DataTypes.DECIMAL)`. Only available in postgres.

***

_This document is automatically generated based on source code comments. Please do not edit it directly, as your changes will be ignored. Please write on <a href="irc://irc.freenode.net/#sequelizejs">IRC</a>, open an issue or a create a pull request if you feel something can be improved. For help on how to write source code documentation see [JSDoc](http://usejsdoc.org) and [dox](https://github.com/tj/dox)_