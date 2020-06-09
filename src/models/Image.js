const { Model, DataTypes } = require('sequelize')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const s3 = new aws.S3()

class Image extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `please inform the name of image`,
                        },
                    },
                },
                size: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `please inform the name of image`,
                        },
                    },
                },
                key: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `please inform the name of image`,
                        },
                    },
                },
                url: {
                    type: DataTypes.STRING,
                    validate: {
                        notEmpty: {
                            msg: `please inform the name of image`,
                        },
                    },
                },
            },
            {
                hooks: {
                    beforeSave: async (file) => {
                        if (!file.url) {
                            file.url = `${process.env.APP_URL}/files/${file.key}`

                            file.url = file.url.replace(' ', '%20')
                        }
                    },
                    beforeDestroy: async (file) => {
                        if (process.env.STORAGE_TYPE === 's3') {
                            console.log('S3 Storage')

                            return s3
                                .deleteObject({
                                    Bucket: 'uploadwecheckout',
                                    Key: file.key,
                                })
                                .promise()
                        } else {
                            return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', file.key))
                        }
                    },
                },
                sequelize,
            }
        )
    }
    static associate(models) {
        this.hasMany(models.VariablesMap, { foreignKey: 'user_id', as: 'product_variation' })
        this.hasMany(models.Client, { foreignKey: 'image_id', as: 'client' })
        this.hasMany(models.Categories, { foreignKey: 'image_id', as: 'category' })
        this.hasOne(models.Stores, { foreignKey: 'image_id', as: 'store' })
    }
}

module.exports = Image
