const { Model, DataTypes } = require('sequelize')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const s3 = new aws.S3()

class ImagesProducts extends Model {
    static init(sequelize) {
        super.init(
            {
                name: DataTypes.STRING,
                size: DataTypes.STRING,
                key: DataTypes.STRING,
                url: DataTypes.STRING,
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
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'images_products' })
    }
}

module.exports = ImagesProducts
